const fs = require(`fs`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

const parentHtml = (createFieldExtension) => {
  createFieldExtension({
    name: `parentHtml`,
    extend() {
      return {
        async resolve(source, args, context, info) {
          const type = info.schema.getType(`MarkdownRemark`)
          const markdownNode = context.nodeModel.getNodeById({
            id: source.parent
          })
          const resolver = type.getFields().html.resolve
          return resolver(markdownNode, {}, context, {
            fieldName: "html"
          })
        }
      }
    }
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions

  // Directives
  parentHtml(createFieldExtension)

  // Schemas
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
