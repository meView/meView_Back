## 프로젝트 소개
> 💡 지인의 리뷰로 알아보는 나만의 강약점 리뷰 서비스

커스텀한 질문지로 지인에게 강약점 리뷰를 받고 이를 모아볼 수 있는 웹 서비스입니다.

![image](https://github.com/meView/meView_Front/assets/73896327/0efe9b1d-6889-4555-b70a-5ad20980efb4)

[🔗 meView 바로가기](https://meview.swygbro.com/)   
[🔗 meView 시연영상 보러가기](https://www.youtube.com/shorts/SaLMO6f_nEY)   

---
## 백엔드 시스템 아키텍처
![35](https://github.com/meView/meView_Back/assets/54920289/e7b5ed93-b4d0-448f-bda2-79a890d7f14f)

### 기술스택
- **언어**: `typescript`
- **프레임워크**: `NestJS`
- **데이터베이스**: `PostgreSQL, AWS RDS`
- **ORM**: `Prisma`
- **Deploy**: `AWS EC2, Route53`
- **CI/CD**: `Docker, Github Actions`
- **HTTPS인증**: `Cerbot`

## ERD


![36](https://github.com/meView/meView_Back/assets/54920289/152fed9c-eac5-402f-905c-1f760105ef74)



## API
![37](https://github.com/meView/meView_Back/assets/54920289/21bb8d8c-55c2-414a-907d-97da53035f95)



## 주요 기능

![image](https://github.com/meView/meView_Front/assets/73896327/6387c721-10cb-468a-a514-2ddf73f49397)
### 소셜 로그인
- 카카오와 구글로 소셜 로그인이 가능합니다.
### 질문지 생성하기
- 리뷰 받고 싶은 질문 항목을 커스텀해 질문지를 생성하고 링크를 복사해 공유할 수 있습니다.
### 지인에게 리뷰 받기
- 지인에게 질문지 공유해 커스텀한 질문지에 대한 리뷰 받을 수 있습니다.
### 홈 페이지
- 내가 만든 질문지를 볼 수 있고, 링크 복사로 공유가 가능합니다.
- 질문지를 수정하고 삭제할 수 있습니다.
### 미뷰 페이지
- 캐릭터에 있는 칩 별로 리뷰를 모아볼 수 있습니다.
- 프로젝트 별로 리뷰를 모아볼 수 있습니다.
