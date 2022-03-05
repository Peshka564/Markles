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
            let s = 0, c = 0, min = 0;
            if(lineChoice === 'Last day') {
                d.setDate(d.getDate() - 1);
            } else if(lineChoice === 'Last week') {
                d.setDate(d.getDate() - 7);
            } else if(lineChoice === 'Last month') {
                d.setMonth(d.getMonth() - 1);
            } else {
                min = 1;
                d = new Date(0)
            }

            let newList = chartData.filter((el) => Date.parse(el.createdAt) >= d.getTime());
            if(auth.user.role !== 'Admin') {
                newList = newList.filter((el) => el.owner.id === auth.user._id);
            }
            
            // get sum and count
            let newArr = [], newMin = 0;
            if(min === 1) newMin = Date.parse(newList[newList.length - 1].createdAt)
            console.log(newMin)
            for(let i = newList.length - 1; i >= 0; i--) {
                if(min === 1) {
                    if(Date.parse(newList[i].createdAt) < newMin) newMin = Date.parse(newList[i].createdAt)
                }
                s += newList[i].amount;
                c++;
                newArr.push({x: newList[i].createdAt, y: newList[i].amount});
            }
            if(min === 1) d = new Date(newMin)

            //Merge points so that the graph is not clustered
            if(newArr.length >= 200) {
                let newNewArr = [];
                const diff = Math.floor((Date.now() - d.getTime())/150);
                for(let i = 1; i <= 150; i++) {
                    let clusterSum = 0;
                    for(let j = 0; j < newArr.length; j++) {
                        if(Date.parse(newArr[j].x) < d.getTime() + diff * i && Date.parse(newArr[j].x) >= d.getTime() + diff * (i - 1)) {
                            clusterSum += newArr[j].y
                        }
                    }
                    newNewArr.push({x: new Date(d.getTime() + diff * i).toUTCString(), y: clusterSum})
                }
                setLineData(newNewArr);
            } else {
                setLineData(newArr);
            }
            setLineSum(s);
            setLineCount(c);
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
                    radius: 1,
                    hitRadius: 3
                }
            },
            scales: {
                x: {
                    grid: {display: false},
                    ticks: {display: false}
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