backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── core/
│   └── db/
├── tests/
├── alembic/
├── alembic.ini
├── pyproject.toml
├── .env.example
└── README.md


# Backend MVP

## 1. 用户
系统有哪些用户？
哪些用户会登录？

## 2. 核心业务流程
老师从进入系统，到完成一次作业批改，依次做什么？

https://www.processon.com/diagraming/6a4f079037d23f02cdae8d02


## 3. 核心资源
列出 Teacher、Class、Student、Homework entities
每个资源只写一句业务含义，不写字段。

## 4. MVP 包含
V0.1基本完成CRUD所有实体
## 5. MVP 不包含