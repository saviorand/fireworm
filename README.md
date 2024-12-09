<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="public/logo.png" alt="Logo" width="250" height="250">

  <h3 align="center">FireWorm</h3>

  <p align="center">
    🔥 Docs for your Mojo projects 🔥
    <br/>

![Written in Mojo][language-shield]
[![MIT License][license-shield]][license-url]
[![Contributors Welcome][contributors-shield]][contributors-url]
[![Join our Discord][discord-shield]][discord-url]

  </p>
</div>

## Overview

FireWorm lets you make a documentation website for your Mojo project.

Just run the `mojo doc` command on your codebase, add the resulting JSON to the project and start the server. You've got your public docs! 🔥
Update the `docs.config.json` file with the description for your project and a link to your Github repo to fetch the README for the home page (custom docs pages coming soon!).

<!-- GETTING STARTED -->

## Getting Started

First, copy the output of `mojo doc` to a `docs.json` file at the root of this repo.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

FireWorm is a NextJS application, so you can deploy it on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) or any other place you can host Next apps.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[language-shield]: https://img.shields.io/badge/language-mojo-orange
[license-shield]: https://img.shields.io/github/license/saviorand/lightbug_http?logo=github
[license-url]: https://github.com/saviorand/lightbug_http/blob/main/LICENSE
[contributors-shield]: https://img.shields.io/badge/contributors-welcome!-blue
[contributors-url]: https://github.com/saviorand/lightbug_http#contributing
[discord-shield]: https://img.shields.io/discord/1192127090271719495?style=flat&logo=discord&logoColor=white
[discord-url]: https://discord.gg/VFWETkTgrr

## Contributors

Want your name to show up here? See [CONTRIBUTING.md](./CONTRIBUTING.md)!

<a href="https://github.com/saviorand/lightbug_docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=saviorand/lightbug_docs" />
</a>

<sub>Made with [contrib.rocks](https://contrib.rocks).</sub>
