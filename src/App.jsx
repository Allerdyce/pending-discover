import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Feed from './components/Feed';

function App() {
    // Simple A/B Logic
    // Check URL param ?variant=b
    const [variant, setVariant] = useState('A');

    const [filters, setFilters] = useState({
        // NOTE: keep existing Variant B filtering behavior intact.
        // We only add an `activityType` field so the Type of Activity control
        // (Leagues / Tournaments / Daily Sports / Events / Private Rentals / Volunteering / Classes)
        // can route results to the right dataset.
        activityType: 'leagues',
        days: [],
        priceType: 'member', // default per UI? or all?
        priceDeals: [],
        venue: '',
        neighborhood: '',
        highlights: [],
        composition: []
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('variant') === 'B' || params.get('variant') === 'b') {
            setVariant('B');
        }
    }, []);

    return (
        <Layout variant={variant} filters={filters} setFilters={setFilters}>
            <Feed filters={filters} />
        </Layout>
    );
}

export default App;
