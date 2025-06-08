import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';
import { extname, join } from 'path';
import fs, { readFileSync } from 'node:fs';
import { Marked, Renderer } from 'marked';
import markedFootnote from 'marked-footnote';
import { markedHighlight } from 'marked-highlight';
import fm from 'front-matter';
import { About, Post, Project } from '../../../types/graphql';
import hljs from 'highlight.js';

const renderer = new Renderer();
const marked = new Marked(
  {
    gfm: true,
    breaks: true,
    renderer: renderer,
  },
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
  markedFootnote()
);

function sanitize(str: any) {
  return str.replace(/&<"/g, function (m: any) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    return '&quot;';
  });
}

/**
 * Parse url of video to return Video ID only
 * if video exists and matches to media's host
 * else undefined
 *
 * @example mediaParseIdFromUrl('youtube', 'https://www.youtube.com/watch?v=fgQRaRqOTr0')
 * //=> fgQRaRqOTr0
 *
 * @param  {string} provider    name of media/video site
 * @param  {string} url         url of video
 * @return {string|undefined}   the parsed id of video, if not match - undefined
 */
function mediaParseIdFromUrl(provider: any, url: any) {
  if (provider === 'youtube') {
    const youtubeRegex =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[7].length == 11) {
      return youtubeMatch[7];
    } else {
      return undefined;
    }
  } else if (provider === 'vimeo') {
    const vimeoRegex = /^.*vimeo.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1].length == 8) {
      return vimeoMatch[1];
    } else {
      return undefined;
    }
  } else if (provider === 'viddler') {
    const viddlerRegex =
      /^.*((viddler.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const viddlerMatch = url.match(viddlerRegex);
    if (viddlerMatch && viddlerMatch[7].length == 8) {
      return viddlerMatch[7];
    } else {
      return undefined;
    }
  } else if (provider === 'dailymotion') {
    const dailymotionRegex =
      /^.+dailymotion.com\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/;
    const dailymotionMatch = url.match(dailymotionRegex);
    if (dailymotionMatch && (dailymotionMatch[5] || dailymotionMatch[3])) {
      if (dailymotionMatch[5]) {
        return dailymotionMatch[5];
      }
      if (dailymotionMatch[3]) {
        return dailymotionMatch[3];
      }
      return undefined;
    } else {
      return undefined;
    }
  } else if (provider === 'html5') {
    const html5Regex = /.+\.(wav|mp3|ogg|mp4|wma|webm|mp3)$/i;
    const html5Match = url.match(html5Regex);

    if (html5Match && html5Match[1]) {
      return { link: html5Match[0], extension: html5Match[1] };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

function createIframe(src: any, title: any, alt: any, height: any, width: any) {
  let res = '<iframe';
  if (title) res += ' title="' + sanitize(title) + '"';
  if (height) res += ' height="' + height + '"';
  if (width) res += ' width="' + width + '"';
  res +=
    ' src="' +
    src +
    '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen class="print:hidden">';
  res += sanitize(alt) + '</iframe>';
  return res;
}

/**
 * Make Marked support specifying image size in pixels in this format:
 *
 * ![alt](src = x WIDTH)
 * ![alt](src = HEIGHT x)
 * ![alt](src = HEIGHT x WIDTH)
 * ![alt](src = x WIDTH "title")
 * ![alt](src = HEIGHT x "title")
 * ![alt](src = HEIGHT x WIDTH "title")
 *
 * Note: whitespace from the equals sign to the title/end of image is all
 * optional. Each of the above examples are equivalent to these below,
 * respectively:
 *
 * ![alt](src =xWIDTH)
 * ![alt](src =HEIGHTx)
 * ![alt](src =HEIGHTxWIDTH)
 * ![alt](src =xWIDTH "title")
 * ![alt](src =HEIGHTx "title")
 * ![alt](src =HEIGHTxWIDTH "title")
 *
 * Example usage:
 *
 * ![my image](https://example.com/my-image.png =400x600 "My image")
 * ![](https://example.com/my-image.png =400x "My image")
 * ![](https://example.com/my-image.png =400x)
 */
// @ts-expect-error
renderer.image = function (src: any, title: any, alt: any) {
  const parts = /(.*)\s+=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(src);
  let url = src;
  let height = undefined;
  let width = undefined;
  if (parts) {
    url = parts[1];
    height = parts[2];
    width = parts[3];
  }
  const YouTube = mediaParseIdFromUrl('youtube', url);
  const Vimeo = mediaParseIdFromUrl('vimeo', url);
  const Viddler = mediaParseIdFromUrl('viddler', url);
  const DailyMotion = mediaParseIdFromUrl('dailymotion', url);
  const Html5 = mediaParseIdFromUrl('html5', url);
  let res = '';
  if (YouTube !== undefined) {
    res = createIframe(
      '//www.youtube.com/embed/' + YouTube,
      title,
      alt,
      height,
      width
    );
  } else if (Vimeo !== undefined) {
    res = createIframe(
      '//player.vimeo.com/video/' + Vimeo + '?api=1',
      title,
      alt,
      height,
      width
    );
  } else if (Viddler !== undefined) {
    res = createIframe(
      '//www.viddler.com/player/' + Viddler,
      title,
      alt,
      height,
      width
    );
  } else if (DailyMotion !== undefined) {
    res = createIframe(
      '//www.dailymotion.com/embed/video/' + DailyMotion,
      title,
      alt,
      height,
      width
    );
  } else if (Html5) {
    res = '<video';
    if (height) res += ' height="' + height + '"';
    if (width) res += ' width="' + width + '"';
    res +=
      ' controls><source src="' +
      Html5['link'] +
      '" type="video/' +
      Html5['extension'] +
      '">';
    if (alt) res += sanitize(alt);
    res += '</video>';
  } else {
    res = '<img ';
    if (height) res += ' height="' + height + '"';
    if (width) res += ' width="' + width + '"';
    res += 'src="' + sanitize(url) + '"';
    if (alt) res += ' alt="' + sanitize(alt) + '"';
    if (title) res += ' title="' + sanitize(title) + '"';
    res += '>';
  }

  return res;
};

function findMarkdownFiles(dir: string) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach(function (file) {
    file = join(dir, file);
    const stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(file));
    } else if (extname(file) === '.md') {
      results.push(file);
    }
  });

  return results;
}

async function parseMarkdownFiles<T>(
  files: string[],
  options?: {
    parseMarkdown?: boolean;
  }
) {
  const posts: T[] = [];
  for (const file of files) {
    const buffer = readFileSync(file, 'utf-8');
    const {
      attributes: frontmatter,
      body,
    }: {
      attributes: Post['frontmatter'];
      body: string;
    } = fm(buffer);
    // @ts-ignore
    const post: T = {
      id: frontmatter?.id,
      frontmatter,
      content: body,
    };
    if (options?.parseMarkdown) {
      // @ts-ignore
      post.content = await parseMarkdown(body);
    }

    posts.push(post);
  }
  return posts;
}

async function parseMarkdown(content: any) {
  return marked.parse(content);
}

const getPosts = async () => {
  const dir = join(process.cwd(), 'content/blog');
  const files = findMarkdownFiles(dir);
  const posts: Post[] = await parseMarkdownFiles<Post>(files);
  return posts;
};

const getPostById = async (id: string) => {
  const posts = await getPosts();
  const post = posts.find(
    (post) => String(post.frontmatter?.id) === String(id)
  );
  if (!post) return null;
  post.content = await parseMarkdown(post.content);
  return post;
};

const getProjects = async () => {
  const dir = join(process.cwd(), 'content/project');
  const files = findMarkdownFiles(dir);
  const projects: Project[] = await parseMarkdownFiles<Project>(files, {
    parseMarkdown: true,
  });
  projects.sort((a, b) =>
    (a.frontmatter?.startAt || a.frontmatter?.id) >
    (b.frontmatter?.startAt || b.frontmatter?.id)
      ? -1
      : 1
  );
  return projects;
};

const getProjectById = async (id: string) => {
  const projects = await getProjects();
  const project = projects.find(
    (project) => String(project.frontmatter?.id) === String(id)
  );
  if (!project) return null;
  project.content = await parseMarkdown(project.content);
  return project;
};

const getAbouts = async () => {
  const dir = join(process.cwd(), 'content/about');
  const files = findMarkdownFiles(dir);
  const abouts: About[] = await parseMarkdownFiles<About>(files);
  return abouts;
};

const getAboutById = async (id: string) => {
  const abouts = await getAbouts();
  const about = abouts.find(
    (about) => String(about.frontmatter?.id) === String(id)
  );
  if (!about) return null;
  about.content = await parseMarkdown(about.content);
  return about;
};

const typeDefs = readFileSync(
  join(process.cwd(), 'src/app/api/graphql/schema.graphql'),
  'utf8'
);
const resolvers = {
  Query: {
    posts: async (): Promise<QueryConnection<Post>> => {
      let posts = await getPosts();
      posts = posts.filter(
        (post) =>
          post.frontmatter?.published &&
          post.frontmatter?.category !== 'codekata'
      );
      posts.sort((a, b) =>
        (a.frontmatter?.updatedAt || a.frontmatter?.createdAt) >
        (b.frontmatter?.updatedAt || b.frontmatter?.createdAt)
          ? -1
          : 1
      );

      return {
        pageInfo: {
          hasNextPage: false,
          endCursor: posts[posts.length - 1]?.id || '',
        },
        edges: posts.map((post) => ({
          cursor: post.frontmatter?.id || '',
          node: post,
        })),
      };
    },
    post: async (_: any, { postId }: { postId: string }): Promise<Post> => {
      const post = await getPostById(postId);
      if (!post) throw new Error('Post not found');
      return post;
    },
    projects: async (): Promise<QueryConnection<Project>> => {
      const projects = await getProjects();

      return {
        pageInfo: {
          hasNextPage: false,
          endCursor: '',
        },
        edges: projects.map((project) => ({
          cursor: project.frontmatter?.id || '',
          node: project,
        })),
      };
    },
    project: async (
      _: any,
      { projectId }: { projectId: string }
    ): Promise<Project> => {
      const project = await getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      return project;
    },
    about: async (_: any, { aboutId }: { aboutId: string }): Promise<About> => {
      const about = await getAboutById(aboutId);
      if (!about) throw new Error('About not found');
      return about;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
