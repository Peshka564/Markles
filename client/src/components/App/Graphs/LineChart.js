import React, {useState, useEffect, useContext} from 'react';
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import { Line } from 'react-chartjs-2';

const LineChart = ({chartData}) => {
    const {auth} = useContext(AuthContext);
    const [lineData, setLineData] = useState([]);
    const [lineChoice, setLineChoice] = useState('Last day');
    const [lineSum, setLineSum] = useState(0);
    const [lineCount, setLineCount] = useState(0);

    useEffect(() => {
        if(chartData.length > 0 && auth.isAuthenticated) {
            let d = new Date();
            let s = 0, c = 0;
            if(lineChoice === 'Last day') {
                d.setDate(d.getDate() - 1);
            } else if(lineChoice === 'Last week') {
                d.setDate(d.getDate() - 7);
            } else if(lineChoice === 'Last month') {
                d.setMonth(d.getMonth() - 1);
            } else {
                d = new Date(0);
            }

            let newList = chartData.filter((el) => Date.parse(el.createdAt) >= d.getTime());
            if(auth.user.role !== 'Admin') {
                newList = newList.filter((el) => el.owner.id === auth.user._id);
            }

            let newArr = [];
            for(let i = newList.length - 1; i >= 0; i--) {
                s += newList[i].amount;
                c++;
                newArr.push({x: newList[i].createdAt, y: newList[i].amount});
            }
            setLineSum(s);
            setLineCount(c);
            setLineData(newArr);
        }
    }, [chartData, lineChoice]);

    const data = {
        datasets: [
            {
                backgroundColor: '#5cdbd7',
                borderColor: '#5cdbd7', 
                borderWidth: 2, 
                data: lineData
            }
        ]
        }
        const options = {
            elements: {
                point:{
                    radius: 0.5,
                    hitRadius: 3
                },
                line: {tension: 0.4}
            },
            scales: {
                x: {
                    ticks: {display: false},
                    grid: {display: false}
                }
            },
            plugins: {
                legend: {display: false},
                tooltip: {displayColors: false}
            }
        }
    return (
        <Row as={Container} className='my-5 chart py-5'>
        <Col md={4}>
            <div className='d-flex flex-column'>
                <h1 className='chart-info'>Deal Data</h1>
                <Dropdown>
                <Dropdown.Toggle className='bg-primary text-white'>{lineChoice}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setLineChoice('Last day')}>Last day</Dropdown.Item>
                    <Dropdown.Item onClick={() => setLineChoice('Last week')}>Last week</Dropdown.Item>
                    <Dropdown.Item onClick={() => setLineChoice('Last month')}>Last month</Dropdown.Item>
                    <Dropdown.Item onClick={() => setLineChoice('All time')}>All time</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                <Button className='my-3 py-3 text-white' disabled>{'Total: ' + lineSum + ' $'}</Button>
                <Button className='mb-3 py-3 text-white'disabled>{'Number of deals: ' + lineCount}</Button>
            </div>
        </Col>
        <Col md={8}>
            <Line data={data} options={options}/>
        </Col>
        </Row>
    )
}

export default LineChart