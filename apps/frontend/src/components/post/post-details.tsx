'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import * as React from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { GET_POST } from '../../graphql/post';
import 'highlight.js/styles/github-dark-dimmed.min.css';
import Comment from './comment';
import { Badge } from '@my-workspace/ui/badge';
import Link from 'next/link';

export default function PostDetails({ dict }: PageComponent) {
  const params = useParams();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalContent, setModalContent] = React.useState('');
  const {
    data: { post },
  } = useSuspenseQuery(GET_POST, {
    variables: {
      postId: params.id,
    },
    fetchPolicy: 'network-only',
  });

  // useEffect(() => {
  //   const onClickHashtag = (e: any) => {
  //     e.preventDefault();
  //
  //     const footnoteId = e.target.id.replace('-ref', '');
  //     const html = document.getElementById(footnoteId)?.innerHTML;
  //     setModalContent(String(html));
  //     onOpen();
  //     // if (e.target.id.startsWith('footnote')) {
  //     //
  //     // }
  //     return false;
  //   };
  //
  //   if (post) {
  //     document.querySelectorAll("[id^='footnote']").forEach((a) => {
  //       a.addEventListener('click', onClickHashtag);
  //     });
  //     return () => {
  //       document.querySelectorAll("[id^='footnote']").forEach((a) => {
  //         a.removeEventListener('click', onClickHashtag);
  //       });
  //     };
  //   }
  // }, [onOpen, post]);

  return (
    <>
      <div className="my-12 px-4">
        <article itemScope itemType="https://schema.org/Article">
          <header className="my-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug py-2">
              {post.frontmatter?.title}
            </h1>
            <div className="flex gap-2 items-center mt-2">
              <span className="text-sm">
                {dayjs(post.frontmatter?.createdAt).format('MMMM DD, YYYY')}
              </span>
              <Badge variant="secondary">{post.frontmatter?.category}</Badge>
            </div>
          </header>
          <section
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
            itemProp="articleBody"
          />
        </article>
        <div className="text-center my-24">
          <Link href="/posts">{dict.toList}</Link>
        </div>
        <Comment post={post} />
      </div>
      {/*<Modal*/}
      {/*  isOpen={isOpen}*/}
      {/*  onOpenChange={onOpenChange}*/}
      {/*  motionProps={{*/}
      {/*    variants: {*/}
      {/*      enter: {*/}
      {/*        opacity: 1,*/}
      {/*        transition: {*/}
      {/*          duration: 0.1,*/}
      {/*          ease: 'easeOut',*/}
      {/*        },*/}
      {/*      },*/}
      {/*      exit: {*/}
      {/*        opacity: 0,*/}
      {/*        transition: {*/}
      {/*          duration: 0.1,*/}
      {/*          ease: 'easeIn',*/}
      {/*        },*/}
      {/*      },*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ModalContent>*/}
      {/*    {(onClose) => (*/}
      {/*      <>*/}
      {/*        <ModalBody*/}
      {/*          className="post-content pt-8"*/}
      {/*          dangerouslySetInnerHTML={{*/}
      {/*            __html: modalContent,*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*  </ModalContent>*/}
      {/*</Modal>*/}
    </>
  );
}
