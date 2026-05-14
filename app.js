const { useState } = React;

const SUPABASE_URL = 'https://tgnionlwzidsuvjuzvrj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbmlvbmx3emlkc3V2anV6dnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NjA3NDQsImV4cCI6MjA5NDAzNjc0NH0.bsRPqA_VzqTJ_30IyUckR4Y7A1cqGH29XUqO_wxtkgc';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const StellarFeedback = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [serviceType, setServiceType] = useState('consulting');
    const [assistedBy, setAssistedBy] = useState('');
    const [kindnessRating, setKindnessRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [comments, setComments] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successName, setSuccessName] = useState('');

    const triggerSuccess = (name) => {
        setSuccessName(name);
        setShowSuccess(true);
        setShowError(false);
        setTimeout(() => {
            setShowSuccess(false);
        }, 4500);
    };

    const triggerError = (message) => {
        setErrorMessage(message);
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => {
            setShowError(false);
        }, 4500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!fullName.trim()) {
            triggerError('Please share your name to continue.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            triggerError('Please enter a valid email address.');
            return;
        }
        if (kindnessRating === 0) {
            triggerError('Please rate the kindness of our team.');
            return;
        }
        if (serviceRating === 0) {
            triggerError('Please rate the quality of our services.');
            return;
        }
        
        setSubmitted(true);
        
        try {
            const { data, error } = await supabase
                .from('feedback')
                .insert([
                    {
                        full_name: fullName.trim(),
                        email: email.trim().toLowerCase(),
                        service_type: serviceType,
                        kindness_rating: kindnessRating,
                        service_rating: serviceRating,
                        comments: comments.trim() || null,
                        created_at: new Date().toISOString()
                        assisted_by: assistedBy.trim() || null,
                    }
                ])
                .select();
            
            if (error) throw error;
            
            console.log('Supabase insert success:', data);
            console.log('=== Stellar 167 Feedback Submission ===');
            console.log({
                company: 'Stellar 167 Group of Companies',
                customer: fullName,
                email: email,
                serviceCategory: serviceType,
                kindnessScore: kindnessRating,
                serviceScore: serviceRating,
                detailedFeedback: comments || 'No additional comments',
                timestamp: new Date().toLocaleString()
            });
            console.log('=========================================');
            
            triggerSuccess(fullName);
            
            setTimeout(() => {
                setFullName('');
                setEmail('');
                setServiceType('consulting');
                setKindnessRating(0);
                setServiceRating(0);
                setComments('');
                setSubmitted(false);
                setAssistedBy('');
            }, 2000);
            
        } catch (err) {
            console.error('Supabase error:', err);
            triggerError('Unable to save feedback. Please try again later.');
            setSubmitted(false);
        }
    };
    
    const renderStars = (currentRating, setRatingFunc, labelText) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    className={`star-btn ${currentRating >= i ? 'active-star' : ''}`}
                    onClick={() => setRatingFunc(i)}
                    aria-label={`Rate ${i} stars`}
                >
                    ★
                </button>
            );
        }
        return (
            <div className="rating-group">
                <span className="rating-label">{labelText}</span>
                <div className="star-rating">
                    {stars}
                    <span className="rating-caption">
                        {currentRating > 0 ? `${currentRating}/5` : 'tap to rate'}
                    </span>
                </div>
            </div>
        );
    };
    
    return (
        <div className="feedback-container">
            <div className="card">
                <div className="card-header">
                    <div className="brand">
                        <h1 className="company-name">Stellar 167 Group of Companies</h1>
                    </div>
                    <p className="subhead">
                        Your voice shapes our constellation — share your experience with precision & warmth.
                    </p>
                </div>
                
                {showSuccess && (
                    <div className="success-message">
                        <span style={{ fontSize: '1.2rem' }}>✓</span> 
                        Thank you, <strong>{successName || 'stellar client'}</strong>! Your feedback has been recorded. We appreciate you.
                    </div>
                )}
                
                {showError && (
                    <div className="error-message">
                        <span style={{ fontSize: '1.2rem' }}>⚠</span> 
                        {errorMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="input-group">
                            <label>Full name *</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Dela Cruz, Juan"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Email address *</label>
                            <input 
                                type="email" 
                                placeholder="hello@stellar.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Service engaged</label>
                            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                                <option value="consulting">Consulting</option>
                                <option value="investment">Advisory</option>
                                <option value="application">Application / Apply</option>
                                <option value="lastpay">Last Pay / Payroll</option>
                                <option value="reporting">Reporting</option>
                                <option value="other">Other services</option>
                            </select>
                        </div>
                        
                        <div className="input-group">
                            <label>Staff / Person who assisted you</label>
                            <input
                                type="text"
                                placeholder="e.g., Ms. Angela Cruz"
                                value={assistedBy}
                                onChange={(e) => setAssistedBy(e.target.value)}
                            />
                        </div>
                                                <div className="double-rating">
                            {renderStars(kindnessRating, setKindnessRating, 'KINDNESS & HOSPITALITY')}
                            {renderStars(serviceRating, setServiceRating, 'SERVICE EXCELLENCE')}
                        </div>
                        
                        <div className="input-group">
                            <label>Your story / additional feedback</label>
                            <textarea 
                                placeholder="Tell us more about your journey with Stellar 167... how did we brighten your experience?"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </div>
                        
                        <button type="submit" className="submit-btn" disabled={submitted}>
                            {submitted ? '✨ Sending...' : 'Send stellar feedback →'}
                        </button>
                    </div>
                </form>
                
                <div className="card-footer">
                    <span>© 2025 Stellar 167 Group of Companies — integrity, empathy, excellence.</span>
                </div>
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<StellarFeedback />);
