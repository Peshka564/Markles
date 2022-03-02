import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Row, Col, Container, Dropdown, Button} from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

const BarChart = ({chartData, userData}) => {
    const { auth } = useContext(AuthContext);
    const [labelData, setLabelData] = useState([]);
    const [topChoice, setTopChoice] = useState('Top 5 employees');
    const [barCount, setBarCount] = useState([]);
    const [barSum, setBarSum] = useState([]);
    const [barChoice, setBarChoice] = useState('Last week');
    const isMedium = useMediaQuery({ query: '(min-width: 768px)' });

    useEffect(() => {
        if(chartData.length > 0 && userData.length > 0 && auth.isAuthenticated) {
            //adjust time period
            let d = new Date();
            if(barChoice === 'Last week') {
                d.setDate(d.getDate() - 7);
            } else if(barChoice === 'Last month') {
                d.setMonth(d.getMonth() - 1);
            } else {
                d = new Date(0);
            }
            const newList = chartData.filter((el) => Date.parse(el.createdAt) >= d.getTime());

            // combine users with deals
            let allObj = [];
            let oneArr = [];
            if(auth.user.role === 'Admin') {
                for(let i = 0; i < userData.length; i++) {
                    let sum = 0, count = 0;
                    for (let j = 0; j < newList.length; j++) {
                        if(userData[i]._id === newList[j].owner.id) {
                            sum += newList[j].amount;
                            count++;
                        }
                    }
                    allObj.push({user: userData[i].firstName + ' ' + userData[i].lastName, sum, count});
                }
            } else {
                let sum = 0, count = 0;
                for (let j = 0; j < newList.length; j++) {
                    if(auth.user._id === newList[j].owner.id) {
                        sum += newList[j].amount;
                        count++;
                    }
                }
                oneArr = [auth.user.firstName + ' ' + auth.user.lastName, sum, count]
            }
            //adjust ranking
            if(auth.user.role === 'Admin') {
                let sliced = [];
                allObj.sort((a, b) => a.sum > b.sum ? -1 : a.sum > b.sum ? 1 : 0);
                if(topChoice === 'Top 5 employees') {
                    sliced = allObj.slice(0, 5);
                } else if(topChoice === 'Top 10 employees') {
                    sliced = allObj.slice(0, 10);
                } else if(topChoice === 'Worst 5 employees') {
                    sliced = allObj.slice(allObj.length - 5, allObj.length).reverse();
                } else if(topChoice === 'Worst 10 employees') {
                    sliced = allObj.slice(allObj.length - 10, allObj.length).reverse();
                }
                // map fields to state
                let sums = [], counts = [], labels = [];
                for(let i = 0; i < sliced.length; i++) {
                    sums.push(sliced[i].sum);
                    counts.push(sliced[i].count);
                    labels.push(sliced[i].user);
                }
                setBarSum(sums)
                setBarCount(counts)
                setLabelData(labels)
            } else {
                setBarSum([oneArr[1]])
                setBarCount([oneArr[2]])
                setLabelData([oneArr[0]])
            }
        }
    }, [userData, chartData, barChoice, topChoice]);

    const data = {
        labels: labelData,
        datasets: [
            {
                label: 'Total $',
                backgroundColor: '#5cdbd7',
                yAxisID: 'yAxis1',
                data: barSum
            },
            {
                label: 'Number of deals',
                backgroundColor: '#3A9D9A',
                yAxisID: 'yAxis2',
                data: barCount
            }
        ]
    }
    const options = {
        plugins: {
            legend: {display: true},
            tooltip: {displayColors: false}
        },
        scales: {
            yAxis1: {
                type: 'linear',
                position: 'left',
                grid: {display: false}
            },
            yAxis2: {
                type: 'linear',
                position: 'right',
                grid: {display: false}
            }
        }
    }
    return (
        <Row as={Container} className='my-5 chart py-5'>
            {!isMedium && 
                <Col md={4}>
                <h1 className='chart-info'>Employee Data</h1>
                    <div className='d-flex flex-column'>
                        <Dropdown className='mb-3'>
                            <Dropdown.Toggle className='bg-primary text-white'>{barChoice}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setBarChoice('Last week')}>Last week</Dropdown.Item>
                                <Dropdown.Item onClick={() => setBarChoice('Last month')}>Last month</Dropdown.Item>
                                <Dropdown.Item onClick={() => setBarChoice('All time')}>All time</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {auth.isAuthenticated && auth.user.role === 'Admin' &&
                            <Dropdown className='mb-3'>
                                <Dropdown.Toggle className='bg-primary text-white'>{topChoice}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setTopChoice('Top 5 employees')}>Top 5 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Top 10 employees')}>Top 10 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Worst 5 employees')}>Worst 5 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Worst 10 employees')}>Worst 10 employees</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </div>
                </Col>
            }
            <Col md={8}>
                <Bar data={data} options={options}/>
            </Col>
            {isMedium && 
                <Col md={4}>
                <h1 className='chart-info'>Employee Data</h1>
                    <div className='d-flex flex-column'>
                        <Dropdown className='mb-3'>
                        <Dropdown.Toggle className='bg-primary text-white'>{barChoice}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setBarChoice('Last week')}>Last week</Dropdown.Item>
                            <Dropdown.Item onClick={() => setBarChoice('Last month')}>Last month</Dropdown.Item>
                            <Dropdown.Item onClick={() => setBarChoice('All time')}>All time</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                        {auth.isAuthenticated && auth.user.role === 'Admin' &&
                            <Dropdown className='mb-3'>
                                <Dropdown.Toggle className='bg-primary text-white'>{topChoice}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setTopChoice('Top 5 employees')}>Top 5 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Top 10 employees')}>Top 10 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Worst 5 employees')}>Worst 5 employees</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTopChoice('Worst 10 employees')}>Worst 10 employees</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </div>
                </Col>
            }
        </Row>
    )
}

export default BarChart