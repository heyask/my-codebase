import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
// import { Modal } from "../modal/modal";
import { cn } from '@my-workspace/lib/utils';

export function ImageWithModal<TData, TValue>({
  src,
  className,
  ...props
}: ImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <Image
        {...props}
        alt={`${props.alt || ''}`}
        className={cn('cursor-pointer', className)}
        src={
          ''
          // src
          //   ? `${AppConfig.FILE_HOST}/uploads/${src}`
          //   : `${AppConfig.FILE_HOST}/static/images/no-image.png`
        }
        onClick={(e) => {
          setOpen(true);
        }}
      />
      {/*<Modal*/}
      {/*  className="min-w-full sm:min-w-[1024px]"*/}
      {/*  showClose={false}*/}
      {/*  content={*/}
      {/*    <>*/}
      {/*      <Image*/}
      {/*        width={1024}*/}
      {/*        height={720}*/}
      {/*        alt=""*/}
      {/*        className="cursor-pointer"*/}
      {/*        src={''*/}
      {/*          // src*/}
      {/*          //   ? `${AppConfig.FILE_HOST}/uploads/${src}`*/}
      {/*          //   : `${AppConfig.FILE_HOST}/static/images/no-image.png`*/}
      {/*        }*/}
      {/*        onClick={(e) => {*/}
      {/*          setOpen(false);*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </>*/}
      {/*  }*/}
      {/*  open={open}*/}
      {/*  onClose={() => setOpen(false)}*/}
      {/*/>*/}
    </React.Fragment>
  );
}
