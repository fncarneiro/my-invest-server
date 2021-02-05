<h1 align="center">Welcome to My Invest Server Rest API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-14.15.x-blue.svg" />
  <a href="https://github.com/fncarneiro/my-invest-server#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/fncarneiro/my-invest-server/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/fncarneiro/my-invest-server/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/fncarneiro/my-invest-server?style=flat" />
  </a>  
  <a href="https://twitter.com/o_fe" target="_blank">
    <img alt="Twitter: o_fe" src="https://img.shields.io/twitter/follow/o_fe.svg?style=social" />
  </a>
</p>


> My Invest Server Rest API
> 
> Simple API to control monthly stocks investments. 
> 
> Developed with Node.js and Express Server, doing CRUD operations on MySql database. Uses basic secuirity with user login, token, CORS and Helmet middleware to set various HTTP headers. 

### 🏠 [Homepage](https://github.com/fncarneiro/my-invest-server#readme)

## Prerequisites

- node 14.15.x
- mysql 2.18.x

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

## Run tests

```sh
npm run test
```

## API

The server speaks [JSON](https://en.wikipedia.org/wiki/JSON). Each request should include a `ContentType` header set to `application/x-www-form-urlencoded`.

This REST / JSON API Endpoint will be available at http://localhost:3000/. Some endpoint will return 'Authentication failed' when visited without a valid OAuth bearer token.

Each request made to private endpoint should include a `Authorization` header set to `JWT ${token}`. The token is returned after successful login in a response body.

Query requests through `GET` method can return status codes `200`, `400`, `401`, or `500`. Mutations through `POST`, `PUT` and `DELETE` can return also codes `201`, `202` and `409`. Invalid routes return status code `404`.

* **200**: Success.
* **201**: Successfully created.
* **202**: Accepted 
* **400**: Invalid resource.
* **401**: Unauthorized access.
* **404**: Resource not found.
* **409**: Conflict. 
* **500**: System error.

## Endpoints

### [public] POST /login

> Logs ​in ​an ​existing ​user.

#### Body fields

| Name     | Type   | Required | Description      |
| -------- | ------ | -------- | ---------------- |
| email    | String | true     | User's email.    |
| password | String | true     | User's password. |


### [private] GET /users

> List all users.

### [private] GET /user/:email/

> List ​a specific ​user.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| email    | String | User's email.   |

### [public] POST /users

> Create a ​user.

#### Body fields

| Name             | Type   | Required | Description       |
| ---------------- | ------ | -------- | ----------------- |
| email            | String | true     | User's email.     |
| password         | String | true     | User's password.  |
| permission_level | Integer| false    | User's permission.|


### [private] PUT /users

> Update a password ​user.

#### Body fields

| Name             | Type   | Required | Description       |
| ---------------- | ------ | -------- | ----------------- |
| email            | String | true     | User's email.     |
| password         | String | true     | User's password.  |


### [private] DELETE /user/:email/

> Delete a specific ​user.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| email    | String | User's email.   |


### [public] GET /investments

> List all investments.

### [public] GET /investments/id/

> List ​s specific investment.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Investment´s id.|

### [private] POST /investments

> Create a investment.

#### Body fields

| Name      | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| period    | Date   | true     | Period (aaaa-mm-dd)|

### [private] PUT /investments/id/

> Update a investment.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Investment´s id.|

#### Body fields

| Name      | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| period    | Date   | true     | Period (aaaa-mm-dd)|

### [prvate] DELETE /investments/id/

> Delete a investment.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Investment´s id.|


### [public] GET /stocks

> List all stocks.

### [public] GET /stocks/id/

> List ​s specific stocks.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Stocks´s id.    |

### [private] POST /stocks

> Create a stock.

#### Body fields

| Name          | Type         | Required | Description        |
| ------------- | ------------ | -------- | ------------------ |
| id_investment | Integer      | true     | Id investment.     |
| stock_name    | Varchar(10)  | true     | Stock ticker.      |
| by_amount     | Integer      | true     | By amount.         |
| by_price      | Decimal(12.2)| true     | By price.          |
| by_tax        | Decimal(12.2)| false    | By tax price.      |
| target_profit | Decimal(12.2)| false    | Target profit (%)  |
| sell_profit   | Decimal(12.2)| false    | Sell profit (%)    |
| sell_amount   | Integer      | false    | Sell amount.       |
| sell_tax      | Decimal(12.2)| false    | Sell tax price.    |
| note          | Varchar(200) | false    | Notes.             |

### [private] PUT /stocks/id/

> Update a stock.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Stocks´s id.    |

#### Body fields

| Name          | Type         | Required | Description        |
| ------------- | ------------ | -------- | ------------------ |
| id_investment | Integer      | true     | Id investment.     |
| stock_name    | Varchar(10)  | true     | Stock ticker.      |
| by_amount     | Integer      | true     | By amount.         |
| by_price      | Decimal(12.2)| true     | By price.          |
| by_tax        | Decimal(12.2)| false    | By tax price.      |
| target_profit | Decimal(12.2)| false    | Target profit (%)  |
| sell_profit   | Decimal(12.2)| false    | Sell profit (%)    |
| sell_amount   | Integer      | false    | Sell amount.       |
| sell_tax      | Decimal(12.2)| false    | Sell tax price.    |
| note          | Varchar(200) | false    | Notes.             |

### [prvate] DELETE /stocks/id/

> Delete a stock.

#### Path parameters

| Name     | Type   | Description     |
| -------- | ------ |---------------- |
| id       | Integer| Stocks´s id.    |



## Author

👤 **Fernando N Carneiro**

* Twitter: [@o_fe](https://twitter.com/o_fe)
* Github: [@fncarneiro](https://github.com/fncarneiro)
* LinkedIn: [@fncarneiro](https://www.linkedin.com/in/fernando-carneiro-17b886184/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/fncarneiro/my-invest-server/issues). You can also take a look at the [contributing guide](https://github.com/fncarneiro/my-invest-server/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Fernando N Carneiro](https://github.com/fncarneiro).<br />
This project is [ISC](https://github.com/fncarneiro/my-invest-server/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
