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
