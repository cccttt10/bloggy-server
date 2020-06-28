## 1

**Endpoint:** `/queryArticleList`

**Method:** `POST`

**Description:**
Given an author, get all articles written by that author that match `filter`.
If `filter` is not provided, return all articles written by that author.
`pagination` is also optional. If `pagination` is not provided, return all matching articles.
For example, the following `pagination` object would return the 20 rows on page 2. There are 20 rows on page 1, so the following `pagination` object would return row 21 to row 40 (row 1 is the first row).

```typescript
{
    limit: 20
    page: 2
}
```

**Request body:**

```typescript
interface QueryArticleListRequestBody {
    _id: IUser['_id']; // author id
    filter?: {
        isAboutPage: IArticle['isAboutPage'];
        isDraft?: IArticle['isDraft'];
        keyword?: IArticle['title'] | IArticle['description']; // search in article title and description for the keyword
    },
    pagination?: {
        limit: number;
        page: number;
    }
}
```

**Response body (if request is valid):**

```typescript
interface QueryArticleListResponseBody {
    count: number;
    articleList: IArticle[];
}
```

**Status codes:**

- 200 for success
- 400 for bad requests

**Error messages:**

- Should return appropriate error messages if the request is bad, e.g. article id is not provided, filter / pagination object is not valid.
- Should test error cases and error messages.

Implement API in `src/routes/article/queryArticleList.ts` and write unit tests in `test/article/queryArticleList.spec.ts`.
