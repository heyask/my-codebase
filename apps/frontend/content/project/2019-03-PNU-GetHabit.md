---
id: 108
title: 'PNU-GetHabit'
description: '대학 4학년 재학중 팀으로 진행한 텀프로젝트로, 커뮤니티에서 사용자간의 인증을 통해 습관 형성을 도와주는 앱'
category: 'Other Projects'
url: 'https://github.com/pnu-004-team5/PNU-GetHabit-android'
startAt: 2019-03
endAt: 2019-06
---

##### <소개>

https://github.com/pnu-004-team5/PNU-GetHabit-android

https://github.com/pnu-004-team5/CreatingHabits

대학 4학년 재학중 팀으로 진행한 텀프로젝트로, 커뮤니티에서 사용자간의 인증을 통해 습관 형성을 도와주는 앱

![시연영상
https://bit.ly/39M741b](https://github.com/pnu-004-team5/PNU-GetHabit-android/raw/master/misc/gethabit_demo.gif)

![구조도](https://github.com/pnu-004-team5/PNU-GetHabit-android/raw/master/misc/gethabit_diagram.png)

구조도

##### <주요 업무>

- **서버 구축** _(AWS EC2, Linux, Nginx, pm2)_
- **데이터베이스 구축** _(PostgreSQL)_
- **API 서버 개발** _(Spring Boot v2.1.4, Java, AWS S3, RestFul API)_
- **안드로이드 앱 개발** _(Java, JCodec v0.1.9(이미지-영상 변환), OpenCV v4.1(얼굴인식), C++)_
- **주요 기능**
  - 계정관리 (로그인, 로그아웃, 회원가입, 회원탈퇴, 이메일인증)
  - CRUD (습관 형성을 위한 습관 체크하기, 습관 일기 쓰기, 다른 사람들과 함께 습관만들기)
  - OpenCV를 활용한 얼굴인식 및 이미지 마스크 씌우기
  - 동영상 녹화와 앱 내에 저장, 저장된 동영상을 aws s3에 업로드 및 앱에서 재생
  - 습관일기에 업로드된 사진파일들을 모아 일기 내용(텍스트)과 합친 일기 타임라인 동영상 생성

##### <업무 상세>

###### 서버 및 데이터베이스 구축

_AWS EC2, Linux, Postgres SQL_

AWS EC2 환경에 데이터베이스와 Spring Api 서버를 올렸습니다.

###### API 서버 개발

_Spring Boot v2.1.4, Java, AWS S3_

자바 기반으로 진행해야 하는 프로젝트였기 때문에, 스프링을 사용하여 Controller ↔ Repository ↔ Model 구조로 API를 개발하였습니다. 파일 관련 작업들은 AWS S3를 통해 개발했습니다.

###### 안드로이드 앱 개발

_Java, JCodec v0.1.9(이미지-영상 변환), OpenCV v4.1(얼굴인식)_

OpenCV의 Haar Cascade를 이용하여 얼굴인식을 구현하고 좌표값을 통해 마스크 이미지를 얼굴 크기에 맞춰 조절하는 방식으로 개발하였습니다.

JCodec 라이브러리를 사용하여 여러 이미지를 영상으로 만드는 기능을 개발하였습니다.

##### <경험>

OpenCV를 활용한 얼굴인식 과정이 해보지 않은 영역이라 특히 재미있었으며 스프링을 사용해보게 된 경험이 되었던 프로젝트였습니다.
