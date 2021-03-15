import React from 'react'
import { useSelector } from 'react-redux'
import { TableContainer, Table, Paper, TableBody, TableRow, TableCell } from '@material-ui/core'



const Users = () => {
  const users = useSelector(state => state.users)
  console.log(users)

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="customized table">
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Blogs</TableCell>
            </TableRow>
            {
              users.map((item) =>
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.blogs.length || 0} </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users