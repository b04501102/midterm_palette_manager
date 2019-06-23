import { gql } from 'apollo-boost'

export const DELETE_PALLETE = gql`
    mutation deletePallete( $id: String ){
        deletePallete(id: $id) {
            title
        }
    }
`