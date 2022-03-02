import React, {useState, useEffect, useContext} from 'react';
import { Row, Col, Container, Dropdown, Button } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import { Pie } from 'react-chartjs-2';

const PieChart = ({chartData}) => {
    const {auth} = useContext(AuthContext);
    const [pieChoice, setPieChoice] = useState('Last day');
    const [topChoice, setTopChoice] = useState('Top 5 items');
    const [pieSum, setPieSum] = useState([]);
    const [labelData, setLabelData] = useState([]);
    const [pieCount, setPieCount] = useState([]);
    const chartColors = 
    [`#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`,
    `#${Math.floor(Math.random()*16777215).toString(16)}`];

    useEffect(() => {
        if(chartData.length > 0 && auth.isAuthenticated) {
            //adjust time period
            let d = new Date();
            if(pieChoice === 'Last day') {
                d.setDate(d.getDate() - 1);
            } else if(pieChoice === 'Last week') {
                d.setDate(d.getDate() - 7);
            } else if(pieChoice === 'Last month') {
                d.setMonth(d.getMonth() - 1);
            } else {
                d = new Date(0);
            }
            const newList = chartData.filter((el) => Date.parse(el.createdAt) >= d.getTime());
            let temp = [];
            for(let i = 0; i < newList.length; i++) {
                temp.push(newList[i].item);
            }
            const itemList = [...new Set(temp)];

            // combine users with deals
            let allObj = [];
            if(auth.user.role === 'Admin') {
                for(let i = 0; i < itemList.length; i++) {
                    let sum = 0, count = 0;
                    for (let j = 0; j < newList.length; j++) {
                        if(itemList[i] === newList[j].item) {
                            sum += newList[j].amount;
                            count++;
                        }
                    }
                    allObj.push({item: itemList[i], sum, count});
                }
            } else {
                for(let i = 0; i < itemList.length; i++) {
                    let sum = 0, count = 0;
                    for (let j = 0; j < newList.length; j++) {
                        if(auth.user._id === newList[j].owner.id && itemList[i] === newList[j].item) {
                            sum += newList[j].amount;
                            count++;
                        }
                    }
                    allObj.push({item: itemList[i], sum, count});
                }
            }
            //adjust ranking
            if(auth.user.role === 'Admin') {
                let sliced = [];
                allObj.sort((a, b) => a.sum > b.sum ? -1 : a.sum > b.sum ? 1 : 0);
                if(topChoice === 'Top 5 items') {
                    sliced = allObj.slice(0, 5);
                } else if(topChoice === 'Top 10 items') {
                    sliced = allObj.slice(0, 10);
                } else if(topChoice === 'Worst 5 items') {
                    sliced = allObj.slice(allObj.length - 5, allObj.length).reverse();
                } else if(topChoice === 'Worst 10 items') {
                    sliced = allObj.slice(allObj.length - 10, allObj.length).reverse();
                }
                //map fields to array
                let sums = [], counts = [], labels = [];
                for(let i = 0; i < sliced.length; i++) {
                    sums.push(sliced[i].sum);
                    counts.push(sliced[i].count);
                    labels.push(sliced[i].item);
                }
                setPieSum(sums)
                setPieCount(counts)
                setLabelData(labels)
            } else {
                let sums = [], counts = [], labels = [];
                for(let i = 0; i < allObj.length; i++) {
                    if(allObj[i].sum > 0) {
                        sums.push(allObj[i].sum);
                        counts.push(allObj[i].count);
                        labels.push(allObj[i].item);
                    }
                }
                setPieSum(sums)
                setPieCount(counts)
                setLabelData(labels)
            }
        }
    }, [chartData, pieChoice, topChoice]);

    const data = {
        labels: labelData,
        datasets: [
            {
                data: pieSum,
                backgroundColor: chartColors
            },
            {
                backgroundColor: chartColors,
                data: pieCount
            }
        ]
    }
    const options = {
        maintainAspectRatio: false
    }
    return (
        <Row as={Container} className='my-5 chart py-5'>
            <Col md={4}>
                <h1 className='chart-info'>Item Data</h1>
                <div className='d-flex flex-column'>
                    <Dropdown className='mb-3'>
                    <Dropdown.Toggle className='bg-primary text-white'>{pieChoice}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setPieChoice('Last day')}>Last day</Dropdown.Item>
                        <Dropdown.Item onClick={() => setPieChoice('Last week')}>Last week</Dropdown.Item>
                        <Dropdown.Item onClick={() => setPieChoice('Last month')}>Last month</Dropdown.Item>
                        <Dropdown.Item onClick={() => setPieChoice('All time')}>All time</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    {auth.isAuthenticated && auth.user.role === 'Admin' &&
                        <Dropdown className='mb-3'>
                            <Dropdown.Toggle className='bg-primary text-white'>{topChoice}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setTopChoice('Top 5 items')}>Top 5 items</Dropdown.Item>
                                <Dropdown.Item onClick={() => setTopChoice('Top 10 items')}>Top 10 items</Dropdown.Item>
                                <Dropdown.Item onClick={() => setTopChoice('Worst 5 items')}>Worst 5 items</Dropdown.Item>
                                <Dropdown.Item onClick={() => setTopChoice('Worst 10 items')}>Worst 10 items</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </div>
            </Col>
            <Col md={8}>
                <Pie data={data} options={options}/>
            </Col>
        </Row>
    )
}

export default PieChart