declare module 'global' {
    export interface ExpressError extends Error {
        status?: number;
    }

    export type ArticleType = 1 | 2 | 3; // 1: blog post, 2: resume, 3: about me
    export type ArticleState = 1 | 2; // 1: draft, 2: published
    export type Originality = 0 | 1 | 2; // 0: original, 1: repost, 2: mixed

    /*
    0: blog owner，1 other, 2: github, 3: wechat, 4: qq
    0, 1 -> registered users, 2, 3, 4 -> third party auth users
    */
    export type UserType = 0 | 1 | 2 | 3 | 4;

    export type SimpleUserType = 0 | 1; // 0: blog: owner, 1: other
    export type CommentState = 0 | 1 | -1 | -2; // 0: pending, 1: approved, -1: deleted, -2: spam

    /*
    1: yes, 2: no
    new comments need to be reviewed by blog owner
    to prevent spam comments
    */
    export type ReviewState = 1 | 2;

    export type ProjectState = 1 | 2 | 3; // 1: finished, 2: in progress, 3: aborted
    export type LinkType = 1 | 2; // 1: external, 2: internal\
    export type LinkVisibility = 1 | 2; // 1: private, 2: public
}
