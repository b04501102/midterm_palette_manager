import { gql } from 'apollo-boost'

export const DELETE_PALLETE = gql`
    mutation deletePallete( $input: String! ){
        deletePallete(id: $input) {
          title
        }
    }
`