import React, {useState, useEffect, useContext} from 'react';
import { Row, Col, Container, Dropdown, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import { Line } from 'react-chartjs-2';

const LineChart = ({chartData, trainAction, predictAction, ai}) => {
    const {auth} = useContext(AuthContext);
    const [lineData, setLineData] = useState([]);
    const [lineChoice, setLineChoice] = useState('Last day');
    const [individual, setIndividual] = useState([])
    const [lineSum, setLineSum] = useState(0);
    const [lineCount, setLineCount] = useState(0);
    const [predictedData, setPredictedData] = useState([])
    const [initial, setInitial] = useState(true)

    useEffect(() => {
        if(chartData.length > 0 && auth.isAuthenticated && lineChoice !== 'Prediction') {
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
            if(auth.user.role !== 'Admin') {
                setIndividual(chartData.filter((el) => el.owner.id === auth.user._id))
            }

            let newList = chartData.filter((el) => Date.parse(el.createdAt) >= d.getTime());
            if(auth.user.role !== 'Admin') {
                newList = newList.filter((el) => el.owner.id === auth.user._id);
            }
            
            // get sum and count
            let newArr = [], newMin = 0;
            if(min === 1) newMin = Date.parse(newList[newList.length - 1].createdAt)
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
    
    useEffect(() => {
        if(ai.predicted.length > 0) {
            setLineData([])
            let pred = []
            let xd = new Date()
            xd.setMonth(xd.getMonth() - 1)
            let d = new Date(xd.getTime())
            for(let i = 0; i < ai.predicted.length; i++) {
                d.setDate(d.getDate() + 1)
                pred.push({x: new Date(d.getTime()).toUTCString(), y: Math.floor(ai.predicted[i])})
            }
            if(!initial) {
                setPredictedData(pred)
                setLineChoice('Prediction');
            }
        }
        setInitial(false)
    }, [ai.predicted])

    const prepareData = (prediction, days) => {
        let previous = []
        if(auth.user.role === 'Admin') {
            previous = chartData
        } else {
            previous = individual
        }
        if(previous.length >= days) {
            let arr = []
            let xd = new Date()
            xd.setMonth(xd.getMonth() - 1)
            let d1 = new Date(xd.getTime())
            let d2 = new Date(xd.getTime())
            /*let d1 = new Date()
            let d2 = new Date()*/
            for(let i = 60; i <= days; i++) {
                d1.setDate(d1.getDate() - 1)
                let s = 0;
                for(let j = previous.length - 1; j >= 0; j--) {
                    if(Date.parse(previous[j].createdAt) > d1.getTime() && Date.parse(previous[j].createdAt) <= d2.getTime()) {
                        s += previous[j].amount
                    }
                }
                d2.setDate(d2.getDate() - 1)
                arr.push(s)
            }
            if(prediction) predictAction({data: {'amount': arr.reverse()}})
            else trainAction({data: {'amount': arr.reverse()}})
        }
    }


    const data = {
        datasets: [
            {
                backgroundColor: '#5cdbd7',
                borderColor: '#5cdbd7', 
                borderWidth: 2, 
                data: lineData
            },
            {
                backgroundColor: '#000',
                borderColor: '#000', 
                borderWidth: 2,
                data: predictedData
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
                        <Dropdown.Item onClick={() => {
                            setLineChoice('Last day') 
                            setPredictedData([])
                        }}>Last day</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setLineChoice('Last week') 
                            setPredictedData([])
                        }}>Last week</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setLineChoice('Last month')
                            setPredictedData([])
                        }}>Last month</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                            setLineChoice('All time') 
                            setPredictedData([])
                        }}>All time</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                    <Button className='my-3 py-3 text-white' disabled>{'Total: ' + lineSum + ' $'}</Button>
                    <Button className='mb-3 py-3 text-white'disabled>{'Number of deals: ' + lineCount}</Button>
                    {!ai.predicting ?
                        <Button className='bg-primary mb-3 py-3 text-white' onClick={() => prepareData(true, 60)}>Predict next month</Button>
                        :
                        <Button className='bg-primary mb-3 py-3 text-white d-flex align-items-center justify-content-center' disabled>
                            <Spinner className='me-2' animation="border"/><h5 className='fs-6 d-inline mt-2'>Loading...</h5>
                        </Button>
                    }
                    {!ai.training ?
                        (!ai.trained ?
                        <Button className='bg-primary mb-3 py-3 text-white' onClick={() => prepareData(false, 360)}>Train the AI</Button>
                        :
                        <Button className='bg-primary mb-3 py-3 text-white' disabled>Model is trained</Button>)
                        :
                        <Button className='bg-primary mb-3 py-3 text-white d-flex align-items-center justify-content-center' disabled>
                            <Spinner className='me-2' animation="border"/><h5 className='fs-6 d-inline mt-2'>Loading...</h5>
                        </Button>
                    }
                </div>
            </Col>
            <Col md={8}>
                <Line data={data} options={options}/>
            </Col>
        </Row>
    )
}

export default LineChart