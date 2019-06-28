import { gql } from 'apollo-boost'

export const UPDATE_PALETTE = gql`
    mutation (
        $palette: PalleteupdateInput!
    ){
        updatePallete(input: $palette) {
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