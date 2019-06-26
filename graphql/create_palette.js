import { gql } from 'apollo-boost'

export const CREATE_PALETTE = gql`
    mutation PostMutation(
        $pallete: PalleteInput
    ){
        createPallete(input: $pallete) {
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