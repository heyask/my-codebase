---
id: 110
title: 'DuckSync 🐥'
description: '파일변경을 감시하여 두 디렉토리간 실시간 동기화를 수행하는 앱'
category: 'Community & Open Sources Activities'
url: 'https://github.com/heyask/DuckSync'
startAt: 2019-12
---

##### <소개>

파일변경을 감시하여 두 디렉토리간 실시간 동기화를 수행하는 앱

https://github.com/heyask/DuckSync

![](https://github.com/heyask/DuckSync/raw/master/misc/screenshot.png)

##### <주요 업무>

- **PC용 앱 개발** _(Electron, React, Redux, Javascript, Sass, Watchman, rsync)_

##### <업무 상세>

###### PC용 클라이언트 앱

_Electron, React, Redux, Javascript, Sass, Watchman, rsync_

Watchman(파일 변경 감시)과 rsync(파일 동기화) 라이브러리를 활용하여 실시간 폴더 동기화 프로그램을 만들어 오픈소스 프로젝트로 배포해 보았습니다.

A디렉토리와 B디렉토리를 설정하면 앱이 실행되는동안 Watchman이 A디렉토리의 파일 수정, 추가, 삭제가 일어나는지 감시하며 해당 이벤트가 발생하면 rsync를 통해 두 디렉토리간 동기화를 수행합니다. Electron과 React로 PC용 UI를 만들고 내부 로직은 Electron상에서 수행되게 하였습니다.

##### <경험>

사용하던 동기화 서비스의 부족한 점을 보완하기 위해 필요하여 만든 프로젝트로, 오픈소스로 배포해본 경험이 유익했던 프로젝트였습니다.
