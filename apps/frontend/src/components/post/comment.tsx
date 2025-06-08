import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { themeState } from '@my-workspace/lib/stores/theme';
import { Post } from '../../types/graphql';
import { cn } from '@my-workspace/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { Icon } from '@my-workspace/ui/icon';

type Props = {
  post: Post;
};
const Comment = React.forwardRef<HTMLDivElement, Props>(({ post }, ref) => {
  const theme = useRecoilValue(themeState);
  // const lang = useRecoilValue(langState);
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const params = useParams();

  const loadScript = useCallback(() => {
    const scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.onload = (e) => {
      let cnt = 0;
      for (let i = 0; i < (containerRef.current?.children.length || 0); i++) {
        if (containerRef.current?.children[i].nodeName == 'DIV') {
          cnt++;
          (
            containerRef.current?.children[i].children[0] as HTMLIFrameElement
          ).onload = (e) => {
            setLoaded(true);
          };
        }
      }

      // 테마 변경으로 댓긆창이 여러개 로딩되면 마지막것만 남기고 제거
      if (cnt > 1) {
        for (
          let i = 0;
          i < (containerRef.current?.children.length || 1) - 1;
          i++
        ) {
          if (containerRef.current?.children[i].nodeName == 'DIV') {
            containerRef.current?.removeChild(containerRef.current.children[i]);
          }
        }
      }
    };
    const attributes = {
      src: 'https://giscus.app/client.js',
      'data-repo': 'heyask/heyask.github.io-comments',
      'data-repo-id': 'R_kgDOLuFd3g',
      'data-category': 'General',
      'data-category-id': 'DIC_kwDOLuFd3s4CesVq',
      'data-mapping': 'specific',
      'data-term': `${post.id}`,
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': `${theme.selector}`,
      'data-lang': `${params.lang}`,
      crossOrigin: 'anonymous',
      async: 'true',
      defer: 'true',
    };
    Object.entries(attributes).forEach(([key, value]) => {
      scriptElement.setAttribute(key, value);
    });
    containerRef.current?.appendChild(scriptElement);
  }, [post, params, theme]);

  // useMount(() => {
  //   loadScript();
  // });

  useEffect(() => {
    // console.log('theme', theme.selector);
    // if (isInitialMount.current) {
    //   isInitialMount.current = false;
    // } else {
    //   loadScript();
    // }
    loadScript();
  }, [theme]);

  // useEffect(() => {
  //   console.log(loaded);
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     console.log(22);
  //     // setLoaded(true);
  //     // loadScript();
  //   }
  //   // console.log(lang);
  //   // if (!post) return;
  //   // const utterances: HTMLScriptElement = document.createElement('script');
  //   //
  //   // utterances.onload = (e) => {
  //   //   let cnt = 0;
  //   //   for (let i = 0; i < (containerRef.current?.children.length || 0); i++) {
  //   //     if (containerRef.current?.children[i].nodeName == 'DIV') {
  //   //       cnt++;
  //   //       (
  //   //         containerRef.current?.children[i].children[0] as HTMLIFrameElement
  //   //       ).onload = (e) => {
  //   //         setLoaded(true);
  //   //       };
  //   //     }
  //   //   }
  //   //
  //   //   // 테마 변경으로 댓긆창이 여러개 로딩되면 마지막것만 남기고 제거
  //   //   if (cnt > 1) {
  //   //     for (
  //   //       let i = 0;
  //   //       i < (containerRef.current?.children.length || 1) - 1;
  //   //       i++
  //   //     ) {
  //   //       if (containerRef.current?.children[i].nodeName == 'DIV') {
  //   //         containerRef.current?.removeChild(containerRef.current.children[i]);
  //   //       }
  //   //     }
  //   //   }
  //   // };
  //   // const attributes = {
  //   //   'src': 'https://utteranc.es/client.js',
  //   //   'repo': 'heyask/heyask.github.io-comments',
  //   //   'issue-term': 'pathname',
  //   //   'label': 'comment',
  //   //   'theme': `github-${theme.selector}`,
  //   //   'crossOrigin': 'anonymous',
  //   //   'async': 'true',
  //   //   'defer': 'true',
  //   // };
  //   // Object.entries(attributes).forEach(([key, value]) => {
  //   //   utterances.setAttribute(key, value);
  //   // });
  //   // containerRef.current?.appendChild(utterances);
  //
  //   // let disqus_config = function() {
  //   //   // @ts-ignore
  //   //   this.page.url = `/posts/${post.id}`; // Replace PAGE_URL with your page's canonical URL variable
  //   //   // @ts-ignore
  //   //   this.page.title = `${post.frontmatter?.title}`; // Replace PAGE_URL with your page's canonical URL variable
  //   //   // @ts-ignore
  //   //   this.page.identifier = `/posts/${post.id}`; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  //   // };
  //   // let d = document,
  //   //   s = d.createElement('script');
  //   // s.src = 'https://sunriv.disqus.com/embed.js';
  //   // s.setAttribute('data-timestamp', String(+new Date()));
  //   // (d.head || d.body).appendChild(s);
  // }, [lang, loaded, setLoaded]);

  return (
    <div>
      {/*<Script*/}
      {/*  id="giscus"*/}
      {/*  src="https://giscus.app/client.js"*/}
      {/*  data-repo="heyask/heyask.github.io-comments"*/}
      {/*  data-repo-id="R_kgDOLuFd3g"*/}
      {/*  data-category="General"*/}
      {/*  data-category-id="DIC_kwDOLuFd3s4CesVq"*/}
      {/*  data-mapping="pathname"*/}
      {/*  data-strict="0"*/}
      {/*  data-reactions-enabled="1"*/}
      {/*  data-emit-metadata="0"*/}
      {/*  data-input-position="bottom"*/}
      {/*  data-theme="preferred_color_scheme"*/}
      {/*  data-lang="en"*/}
      {/*  crossOrigin="anonymous"*/}
      {/*  async*/}
      {/*/>*/}
      {/*<div id="disqus_thread" />*/}
      {!loaded && (
        <div>
          <Icon icon="luc" />
        </div>
      )}
      <div ref={containerRef} className={cn('min-h-96')} />
    </div>
  );
});

Comment.displayName = 'Comment';

export default Comment;
