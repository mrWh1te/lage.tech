module.exports = {
  plugins: [
    // with gatsby-plugin-theme-ui, the last theme in the config
    // will override the theme-ui context from other themes
    { resolve: `gatsby-theme-blog` },
    { resolve: `gatsby-plugin-typescript` },
    { resolve: `gatsby-plugin-emotion`},
    {
      resolve: `gatsby-theme-notes`,
      options: {
        mdx: false,
        basePath: `/notes`,
      },
    }
  ],
  siteMetadata: {
    title: `Lage.tech`,
    author: 'Michael Lage',
    description: `Technology blog focusing on Software`,
    // Used for resolving images in social cards
    siteUrl: `https://www.lage.tech`,
    // Used for social links in the root footer
    social: [
      {
        name: `Twitter`,
        url: `https://twitter.com/mpbl`,
      },
      {
        name: `GitHub`,
        url: `https://github.com/mrWh1te`,
      },
      {
        name: `LinkedIn`,
        url: `http://linkedin.com/in/michaellage`,
      },
      {
        name: `Instagram`,
        url: `https://instagram.com/lagmahol`,
      },
    ],
  },
}