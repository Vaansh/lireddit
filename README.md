<!--
**       .@@@@@@@*  ,@@@@@@@@     @@@     .@@@@@@@    @@@,    @@@% (@@@@@@@@
**       .@@    @@@ ,@@          @@#@@    .@@    @@@  @@@@   @@@@% (@@
**       .@@@@@@@/  ,@@@@@@@    @@@ #@@   .@@     @@  @@ @@ @@/@@% (@@@@@@@
**       .@@    @@% ,@@        @@@@@@@@@  .@@    @@@  @@  @@@@ @@% (@@
**       .@@    #@@ ,@@@@@@@@ @@@     @@@ .@@@@@@.    @@  .@@  @@% (@@@@@@@@
-->

<!-- HEADERS -->
<p align="center">
  <a href="https://github.com/Vaansh/lireddit/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Vaansh/lireddit.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Vaansh/lireddit/network/members">
    <img src="https://img.shields.io/github/forks/Vaansh/lireddit.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Vaansh/lireddit/stargazers">
    <img src="https://img.shields.io/github/stars/Vaansh/lireddit.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Vaansh/lireddit/issues">
    <img src="https://img.shields.io/github/issues/Vaansh/lireddit.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Vaansh/lireddit/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/gatsbyjs/gatsby.svg?style=for-the-badge">
  </a>
  <a href="https://linkedin.com/in/Vaansh">
    <img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555">
  </a>
</p>

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Vaansh/lireddit">
    <img src="https://i.pinimg.com/originals/0d/f7/5a/0df75a7a9d23f959a2b81996400ac752.png" alt="Logo" height="120">
  </a>

  <h3 align="center">LiReddit</h3>

  <p align="center">
    A lightweight reddit alternative.
    <br />
    <a href="https://github.com/Vaansh/lireddit"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://vaansh.me">View Demo</a>
    ·
    <a href="https://github.com/Vaansh/lireddit/issues">Report Bug</a>
    ·
    <a href="https://github.com/Vaansh/lireddit/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#deployment-guide">Deployment Guide</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About The Project

This is a fullstack website that is deployed on Azure and Vercel. The motive behind this was for me to learn about the different technologies involved in modern web development.

<a href="https://vaansh.me">
    <img src="https://i.imgur.com/lvpvv7d.png">
  </a>

### Built With

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=Chakra%20UI&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Azure-0089D6?style=for-the-badge&logo=Microsoft-Azure&logoColor=white">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white">  
</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

You can clone use the docker image and deploy it to on any virtual machine.

- dokku 0.19.x+
- docker 1.8.x

### Deployment Guide

1. Create the app and configure `redis` and `postgres` plugins

```zsh
dokku apps:create <app-name>
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
dokku postgres:create <postgres-name>
dokku postgres:link <postgres-name> <app-name>
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git
dokku redis:create <redis-name>
dokku redis:link <redis-name> <app-name>
```

2. Encrypt with the `letsencrypt` plugin for dokku

```zsh
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=<your-email@email.com>
dokku domains:report <app-name>
dokku domains:remove <preset-domain-name>
dokku domains:add <app-name> <your-domain-name>
dokku domains:report <app-name>
dokku proxy:ports-add <app-name> http:80:8080
dokku letsencrypt:enable <app-name>
```

3. Pull the latest docker image and deploy

```zsh
sudo docker pull vaansh/lireddit:5
sudo docker tag vaansh/lireddit:5 dokku/<app-name>:latest
dokku tags:deploy <app-name> latest
```

## Usage

Test the app by registering with a new email or with the credentials below:

```
email: demo@demo
user: demo
pass: demo
```

Some functionalities

- upvote/downvote posts
- edit/delete posts that you own
- posts are loaded chronologically
- login/register (sensitive credentials hashed using argon)

## Roadmap

See the [open issues](https://github.com/Vaansh/lireddit/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Vaansh Lakhwara - [@1nshed](https://twitter.com/vaansh_lakhwara) - vaanshlakhwara@gmail.com

Project Link: [https://github.com/Vaansh/lireddit](https://github.com/Vaansh/lireddit)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Ben Awad](https://www.benawad.com)
- [LiReddit Logo](https://i.pinimg.com/originals/0d/f7/5a/0df75a7a9d23f959a2b81996400ac752.png)
- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Img Shields](https://shields.io)
- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Pages](https://pages.github.com)
- [Animate.css](https://daneden.github.io/animate.css)
- [Loaders.css](https://connoratherton.com/loaders)
- [Slick Carousel](https://kenwheeler.github.io/slick)
- [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
- [Sticky Kit](http://leafo.net/sticky-kit)
- [JVectorMap](http://jvectormap.com)
- [Font Awesome](https://fontawesome.com)
