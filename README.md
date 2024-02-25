## 테스트 방법

### test data

<br />

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

### 질문지 생성하기

```js
const url = 'http://localhost:4000/question/create';
const data = {
    "question_target": "TEAM",
    "question_title": "TEST",
    "question_type": "STRENGTH"
};
const headers = {
	'Authorization': `Bearer ${access_token}`
};


axios.post(url, data, { headers });
```

<br />

### Response 

```json
{
    "success": true,
    "code": "OK",
    "data": {
        "message": "Your question has been saved successfully."
    },
    "statusCode": 200
}
```