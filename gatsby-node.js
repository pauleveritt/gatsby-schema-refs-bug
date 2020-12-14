const fs = require(`fs`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const fullFn = path.join(__dirname, `./types.graphql`)
  const coreTypes = fs.readFileSync(`${fullFn}`, {
    encoding: `utf-8`
  })
  createTypes(coreTypes)
}

exports.onCreateNode = ({
                          node, getNode, actions,
                          createNodeId, createContentDigest
                        }) => {
  const { createNode, createParentChildLink } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // Get the content type
    const resourceType = node.frontmatter.type
    if (!resourceType) return

    const fieldData = { ...node.frontmatter }
    const slug = createFilePath({ node, getNode })
    const resourceNode = {
      ...fieldData,
      id: createNodeId(`${node.id} >>> ${resourceType}`),
      slug,
      parent: node.id,
      children: [],
      internal: {
        type: resourceType,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData)
      }
    }
    createNode(resourceNode)
    createParentChildLink({
      parent: node,
      child: resourceNode
    })
    return resourceNode
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  return
  const result = await graphql(`
    query {
      allResource {
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
  return
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/tip.jsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug
      }
    })
  })
}