import React from "react"
import { graphql } from "gatsby"

export default function Tip({ data }) {
  const tip = data.markdownRemark
  return (
    <div>
      <h1>Post: {tip.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: tip.html }} />
    </div>
  )
}
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`