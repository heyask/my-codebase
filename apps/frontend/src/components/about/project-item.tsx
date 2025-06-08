import * as React from 'react';
import Link from 'next/link';

const ProjectItem = ({ title, content, date, detail, link, ...props }: any) => {
  return (
    <div>
      <h3>
        {title} <small>{date}</small>
      </h3>
      <div>
        <p>{content}</p>
        <p>
          {detail && (
            <Link href="#" target="_blank">
              자세히
            </Link>
          )}
          {link && (
            <Link href={link} target="_blank">
              {/*<Icon path={mdiLink} size={1} />*/}_
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProjectItem;
