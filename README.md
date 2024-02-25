## 테스트 방법

### test data

```sql
insert into "SWYP_User" values(1, 'test@naver.com', 'test', 'KAKAO');
insert into "SWYP_Question" values(1, 1, 'STRENGTH', 'TEAM', 'test', now(), true);

insert into "SWYP_Chip" values(1, 'JUDGMENT');
insert into "SWYP_Chip" values(2, 'OBSERVATION');
insert into "SWYP_Chip" values(3, 'LISTENING');
insert into "SWYP_Chip" values(4, 'COMMUNICATION');
insert into "SWYP_Chip" values(5, 'FRIENDLINESS');
insert into "SWYP_Chip" values(6, 'EXECUTION');
insert into "SWYP_Chip" values(7, 'PERSEVERANCE');
```

### 질문지 불러오기

```js
axios.get(`http://localhost:4000/answer/${question_id}`);
```

### Response

<br />

```json
{
  "success": true,
  "code": "OK",
  "data": {
    "question_id": 1,
    "question_title": "test",
    "user_id": 1,
    "user": {
      "user_nickname": "test"
    }
  },
  "statusCode": 200
}
```

### 답변 작성

<br />

```js
const url = 'http://localhost:4000/answer/create';
const data = {
  user_id: 1,
  question_id: 1,
  response_title: 'test',
  response_responder: 'test',
  reviewData: [
    {
      review_type: 'STRENGTH',
      review_description: 'test',
      chip_id: 1,
    },
    {
      review_type: 'STRENGTH',
      review_description: 'test',
      chip_id: 2,
    },
    {
      review_type: 'STRENGTH',
      review_description: 'test',
      chip_id: 3,
    },
  ],
};

axios.post(url, data);
```

### Response

```json
{
  "success": true,
  "code": "OK",
  "data": {
    "message": "답변이 성공적으로 저장되었습니다."
  },
  "statusCode": 200
}
```
