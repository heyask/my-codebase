'use client';

import * as React from 'react';
import { GET_PROJECTS } from '../../graphql/project';
import ProjectItemList from './project-item-list';
import dayjs from 'dayjs';
import { Switch } from '@my-codebase/ui/switch';

export default function ProjectHome({ dict }: PageComponent) {
  const [listView, setListView] = React.useState(false);

  return (
    <div className="px-6">
      <div className="print:hidden text-sm text-right mt-8">
        <div className="italic text-sm text-right mt-8">
          Updated at {dayjs('2024-04-01').format('MMMM DD, YYYY')}
        </div>
        <div className="flex gap-1.5 justify-end my-2">
          <Switch
            checked={listView}
            // TODO
            onCheckedChange={async (checked: any) => {
              setListView(checked);
            }}
            color="default"
          />
        </div>
      </div>
      <h1 className="text-3xl leading-snug font-bold mt-10 mb-2">
        김승현 (SeungHyun Kim, Andy, 金承炫) Projects
      </h1>
      <ul className="pl-4 sm:pl-8 mb-3">
        <li className="list-disc text-sm leading-relaxed mb-1.5">
          Software Engineer / Web, Mobile
        </li>
      </ul>
      <ProjectItemList
        query={GET_PROJECTS}
        queryName="projects"
        flags={{
          listView,
        }}
      />
    </div>
  );
}
