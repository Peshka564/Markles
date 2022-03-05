import React, {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../../../context/AuthContext.js';
import {
  Table,
  Dropdown,
  Button,
  Card
} from 'react-bootstrap';
import {
  FaAngleRight,
  FaAngleLeft,
  FaUserSlash
} from 'react-icons/fa';
import './TableStyle.css';
import { useMediaQuery } from 'react-responsive';

const CustomTable = ({data, getAction, sortAction, deleteAction, fields}) => {
  const limit = 20;
  const maxPages = Math.ceil(data.length / limit);
  const {auth} = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const isMedium = useMediaQuery({ query: '(min-width: 768px)' });

  useEffect(() => {
    if(auth.isAuthenticated) getAction()
  }, [auth.isAuthenticated])

  return (
    <>
      {!isMedium ? 
        fields[2] === 'Role' ? 
        data.map((element, i) => {
          if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
            return <Card key={element._id}>
              <Card.Header><h3>{`${fields[0]}: ${element.firstName + ' ' + element.lastName}`}
              {element._id !== auth.user._id && auth.user.role === 'Admin' && element.role !== 'Admin' && <FaUserSlash className='delete-icon ms-auto' onClick={() => deleteAction({id: element._id})} />}
              </h3>
              </Card.Header>
              <Card.Body>
                <h4>{`${fields[1]}: ${element.email}`}</h4>
                <h4>{`${fields[2]}: ${element.role}`}</h4>
              </Card.Body>
            </Card>
          }
        }) : fields[0] === 'Name' ?
        data.map((element, i) => {
          if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
            return <Card key={element._id}>
              <Card.Header><h3>{`${fields[0]}: ${element.firstName + ' ' + element.lastName}`}
              {(element.owner.id === auth.user._id || auth.user.role === 'Admin') && <FaUserSlash className='delete-icon ms-auto' onClick={() => deleteAction({id: element._id})}/>}
              </h3>
              </Card.Header>
              <Card.Body>
                <h4>{`${fields[1]}: ${element.email}`}</h4>
                <h4>{`${fields[2]}: ${element.companyFrom}`}</h4>
                <h4>{`${fields[3]}: ${element.phone}`}</h4>
                <h4>{`${fields[4]}: ${element.owner.name}`}</h4>
              </Card.Body>
            </Card>
          }
        }) : 
        data.map((element, i) => {
          if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
            return <Card key={element._id}>
              <Card.Header><h3>{`${fields[0]}: ${element.item}`}
              {(element.owner.id === auth.user._id || auth.user.role === 'Admin') && <FaUserSlash className='delete-icon ms-auto' onClick={() => deleteAction({id: element._id})}/>}  
              </h3>
              </Card.Header>
              <Card.Body>
                <h4>{`${fields[1]}: ${element.amount}`}</h4>
                <h4>{`${fields[2]}: ${element.partner}`}</h4>
                <h4>{`${fields[3]}: ${element.owner.name}`}</h4>
              </Card.Body>
            </Card>
          }
        })
      :
      <Table striped bordered hover>
        <thead className="bg-dark text-white">
          <tr>
            {fields.map((field, i) => {
              return <th key={i}>      
                {field === 'Phone' ?
                  <Button variant="dark" className="bg-dark text-white shadow-none disabled">
                    <h4 className="dropdown-toggle-text fw-bold fs-6">{field}</h4>
                  </Button>
                  : 
                  <Dropdown>
                    <Dropdown.Toggle variant="dark" className="bg-dark text-white shadow-none">
                      <h4 className="dropdown-toggle-text fw-bold fs-6">{field}</h4>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {field !== 'Amount' ? 
                      <><Dropdown.Item onClick={() => sortAction({way: i*2+11, data})}>Sort A-Z</Dropdown.Item>
                      <Dropdown.Item onClick={() => sortAction({way: i*2+12, data})}>Sort Z-A</Dropdown.Item></>
                      :
                      <><Dropdown.Item onClick={() => sortAction({way: i*2+11, data})}>Sort Ascending</Dropdown.Item>
                      <Dropdown.Item onClick={() => sortAction({way: i*2+12, data})}>Sort Descending</Dropdown.Item></>
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                }
              </th>
            })}
            </tr>
        </thead>
        <tbody>
          {fields[2] === 'Role' ? 
          data.map((element, i) => {
            if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
              return <tr key={i} className="bg-secondary">
              <th>{element.firstName + ' ' + element.lastName}</th>
              <th>{element.email}</th>
              <th className='d-flex flex-row justify-content-between'>{element.role}
              {element._id !== auth.user._id && auth.user.role === 'Admin' && element.role !== 'Admin' && <FaUserSlash className='delete-icon' onClick={() => deleteAction({id: element._id})} />}
              </th>
              </tr>
            }
          }) : fields[0] === 'Name' ?
          data.map((element, i) => {
            if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
              return <tr key={i} className="bg-secondary">
              <th>{element.firstName + ' ' + element.lastName}</th>
              <th>{element.email}</th>
              <th>{element.companyFrom}</th>
              <th>{element.phone}</th>
              <th className='d-flex flex-row justify-content-between'>{element.owner.name}
              {(element.owner.id === auth.user._id || auth.user.role === 'Admin') && <FaUserSlash className='delete-icon' onClick={() => deleteAction({id: element._id})}/>}
              </th>
              </tr>
            }
          }) : 
          data.map((element, i) => {
            if((i+1) > (page-1)*limit && (i+1) < (page)*limit+1) {
              return <tr key={i} className="bg-secondary">
              <th>{element.item}</th>
              <th>{element.amount + ' $'}</th>
              <th>{element.partner}</th>
              <th className='d-flex flex-row justify-content-between'>{element.owner.name}
              {(element.owner.id === auth.user._id || auth.user.role === 'Admin') && <FaUserSlash className='delete-icon' onClick={() => deleteAction({id: element._id})}/>}
              </th>
              </tr>
            }
          })}
        </tbody>
      </Table>}
      {maxPages > 1 &&
      <div className='mx-auto'>
        <Button variant="primary" className="text-white shadow-none me-3" type="submit" onClick={() => page > 1 && setPage(page-1)}><FaAngleLeft style={{width: '20px'}}/></Button>
        {page} / {maxPages}
        <Button variant="primary" className="text-white shadow-none ms-3" type="submit" onClick={() => page < maxPages && setPage(page+1)}><FaAngleRight style={{width: '20px'}}/></Button>
      </div>}
    </>
  )
}

export default CustomTable;
