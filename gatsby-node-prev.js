const fs = require(`fs`)
const path = require(`path`)


const POST_NODE_TYPE = `Post`
const TIP_NODE_TYPE = `Tip`
const AUTHOR_NODE_TYPE = `Author`

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const fullFn = path.join(__dirname, `./types.graphql`)
  const coreTypes = fs.readFileSync(`${fullFn}`, {
    encoding: `utf-8`
  })
  createTypes(coreTypes)
}

exports.sourceNodes = async ({
                               actions,
                               createContentDigest,
                               createNodeId
                             }) => {
  const { createNode } = actions
  const data = {
    authors: [
      { id: 100, name: `paul` },
      { id: 101, name: `maria` }
    ],
    resources: [
      { type: "Post", id: 1, description: `Hello world!`, author: `paul` },
      { type: "Post", id: 2, description: `Second post!`, author: `maria` },
      { type: "Tip", id: 51, description: `Tip 1`, author: `paul` },
      { type: "Tip", id: 52, description: `Another Tip`, author: `maria` }
    ]
  }
  // loop through data and create Gatsby nodes
  data.authors.forEach(author =>
    createNode({
      ...author,
      id: createNodeId(`${AUTHOR_NODE_TYPE}-${author.id}`),
      parent: null,
      children: [],
      internal: {
        type: AUTHOR_NODE_TYPE,
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author)
      }
    })
  )
  data.resources.forEach(resource =>
    createNode({
      ...resource,
      id: createNodeId(`${resource.type}-${resource.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: JSON.stringify(resource),
        contentDigest: createContentDigest(resource)
      }
    })
  )
}


//  #########

const fs = require(`fs`)
const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)

const POST_NODE_TYPE = `Post`
const TIP_NODE_TYPE = `Tip`
const AUTHOR_NODE_TYPE = `Author`

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const fullFn = path.join(__dirname, `./types.graphql`)
  const coreTypes = fs.readFileSync(`${fullFn}`, {
    encoding: `utf-8`
  })
  createTypes(coreTypes)
}

exports.sourceNodes = async ({
                               actions,
                               createContentDigest,
                               createNodeId,
                               getNodesByType
                             }) => {
  const { createNode } = actions
  const data = {
    authors: [
      { id: 100, name: `paul` },
      { id: 101, name: `maria` }
    ],
    posts: [
      { id: 1, description: `Hello world!`, author: `paul` },
      { id: 2, description: `Second post!`, author: `maria` }
    ],
    tips: [
      { id: 51, description: `Tip 1`, author: `paul` },
      { id: 52, description: `Another Tip`, author: `maria` }
    ]
  }
  // loop through data and create Gatsby nodes
  data.authors.forEach(author =>
    createNode({
      ...author,
      id: createNodeId(`${AUTHOR_NODE_TYPE}-${author.id}`),
      parent: null,
      children: [],
      internal: {
        type: AUTHOR_NODE_TYPE,
        content: JSON.stringify(author),
        contentDigest: createContentDigest(author)
      }
    })
  )
  data.posts.forEach(post =>
    createNode({
      ...post,
      id: createNodeId(`${POST_NODE_TYPE}-${post.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: JSON.stringify(post),
        contentDigest: createContentDigest(post)
      }
    })
  )
  data.tips.forEach(tip =>
    createNode({
      ...tip,
      id: createNodeId(`${TIP_NODE_TYPE}-${tip.id}`),
      parent: null,
      children: [],
      internal: {
        type: TIP_NODE_TYPE,
        content: JSON.stringify(tip),
        contentDigest: createContentDigest(tip)
      }
    })
  )
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug
      }
    })
  })
}