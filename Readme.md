# HackerSchool

[About, Promotion, Course link, etz]

## Development

This is based off of the official `@vue/cli` template with TypeScript configured.

**Commands**

    # Get dependencies
    $ npm install
    # Start development server
    $ npm run serve
    # Build for production (results under /dist)
    $ npm run build

If necessary, `npm run lint` will execute TSLint on it's own. Usually, it's part of "serve" and "build".

### Tips

**Changes to TypeScript files are not reflected by the development server**

If no changes are making it to the live version, check if WebStorm/IntelliJ is compiling TypeScript files and placing the resulting `*.js` and `*.js.map` files in the same directory. If it does, these will be preferred and used instead of the actual `*.ts` files. Delete the files to fix this.

To prevent WebStorm/IntelliJ from doing it again, go to "File > Settings > Languages & Frameworks > TypeScript", click on the "..." Button next to "Compile Scope", create a new Scope and recursively exclude the projects root directory. This way, the IDE will not find any `*.ts` files and won't compile any of them.
