import { gql } from 'apollo-boost'

export const PALLETES_QUERY = gql`
query {
	getPalletes {
        _id
		title
		author
        comments
        image
        colors
        tags
        create_at
        last_modified_at
	}
}
`