import { IArticle } from '../../src/models/article';

const articles: IArticle[] = [
    {
        title: 'test blog 1',
        author: undefined,
        description: 'this is my blog 1',
        content: `# Blog Server

        This repo contains the server code for Blog Project. First of all, place the \`.env\` file  (which contains passwords and is not committed to version control) in the project root directory.
        
        ## Available Commands
        
        - \`npm run fix\`: fix auto-fixable code style problems
        
        - \`npm run check\`: check code style against lint rules and check TypeScript compilation
        - \`npm run build\`: compile
        - \`npm run start-dev\`: start server in development mode, make sure code has been compiled before running
        - \`npm run test\`: run test suites, make sure code has been compiled before running tests`,
        imgUrl: 'https://s1.ax1x.com/2020/05/15/YDzq7d.jpg',
        isDraft: false,
        isAboutPage: false,
    },
    {
        title: 'test blog 2',
        author: undefined,
        description: 'this is my blog 2',
        content: 'draft',
        imgUrl: 'https://s1.ax1x.com/2020/05/15/YDzq7d.jpg',
        isDraft: true,
        isAboutPage: false,
    },
    {
        title: 'about page',
        author: undefined,
        description: 'this is my about page',
        content: 'about page',
        imgUrl: 'https://s1.ax1x.com/2020/05/15/YDzq7d.jpg',
        isDraft: false,
        isAboutPage: true,
    },
];

export default articles;
