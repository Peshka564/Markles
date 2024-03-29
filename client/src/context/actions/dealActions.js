export const getDeals = async (transport, {dealDispatch, auth}) => {
    try {
        const res = await transport.post('/api/deals/get', auth)
        dealDispatch({
            type: 'DEALS_GET',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
};

export const addDeal = async (transport, {deal, auth}) => {
    const body = {
        item: deal.item,
        amount: deal.amount,
        owner: {
            id: auth.user._id,
            name: auth.user.firstName + ' ' + auth.user.lastName
        },
        partner: deal.partner,
        company: auth.user.company
    }

    try {
        await transport.post('/api/deals/add', body)
    } catch (error) {
        return error.response;
    }
};

export const deleteDeal = async (transport, {id}) => {
    try {
        await transport.delete(`/api/deals/delete/${id}`);
    } catch (error) {
        return error.response;
    }
};

export const trainDeals = async (transport, {dealDispatch, data}) => {
    try {
        dealDispatch({
            type: 'DEALS_TRAIN'
        })
        const res = await transport.post('http://127.0.0.1:5000/train', data)
        dealDispatch({
            type: 'DEALS_TRAINED'
        })
        dealDispatch({
            type: 'DEALS_PREDICTION',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
}

export const predictDeals = async (transport, {dealDispatch, data}) => {
    try {
        dealDispatch({
            type: 'DEALS_PREDICT'
        })
        //const res = await transport.post('http://127.0.0.1:5000/predict', data)
        const res = await transport.post('https://markles-ai.herokuapp.com/', data)
        //const res = await transport.post('https://marklesai.herokuapp.com/', data)
        dealDispatch({
            type: 'DEALS_PREDICTION',
            payload: res.data
        })
    } catch (error) {
        return error.response;
    }
}

export const sortDeals = async (transport, {way, data, dealDispatch, auth}) => {
    try {
        const deals = data;
        const compareAttributes = (a, b, dir, letter) => {
            if (letter === 'i')
            {
                if(a.item.toUpperCase() > b.item.toUpperCase()) return 1 * dir
                else if(a.item.toUpperCase() < b.item.toUpperCase()) return -1 * dir
                return 0            
            }
            if (letter === 'a')
            {
                if(a.amount > b.amount) return 1 * dir
                else if(a.amount < b.amount) return -1 * dir
                return 0            
            }
            if (letter === 'p')
            {
                if(a.partner.toUpperCase() > b.partner.toUpperCase()) return 1 * dir
                else if(a.partner.toUpperCase() < b.partner.toUpperCase()) return -1 * dir
                return 0            
            }
            if (letter === 'o')
            {
                if(a.owner.name.toUpperCase() > b.owner.name.toUpperCase()) return 1 * dir
                else if(a.owner.name.toUpperCase() < b.owner.name.toUpperCase()) return -1 * dir
                return 0            
            }
        }
        switch(way) {
            case 11: 
                deals.sort((a, b) => compareAttributes(a, b, 1, 'i'));
                break;
            case 12:
                deals.sort((a, b) => compareAttributes(a, b, -1, 'i'));
                break;
            case 13: 
                deals.sort((a, b) => compareAttributes(a, b, 1, 'a'));
                break;
            case 14:
                deals.sort((a, b) => compareAttributes(a, b, -1, 'a'));
                break;
            case 15: 
                deals.sort((a, b) => compareAttributes(a, b, 1, 'p'));
                break;
            case 16:
                deals.sort((a, b) => compareAttributes(a, b, -1, 'p'));
                break;
            case 17: 
                deals.sort((a, b) => compareAttributes(a, b, 1, 'o'));
                break;
            case 18:
                deals.sort((a, b) => compareAttributes(a, b, -1, 'o'));
                break;
            default:
                break;
        }
        dealDispatch({
            type: 'DEALS_GET',
            payload: deals
        })
    } catch (error) {
        return error.response;
    }
};