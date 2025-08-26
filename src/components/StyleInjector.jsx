// src/components/StyleInjector.jsx
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { GlobalStyles } from '@mui/material';

const StyleInjector = () => {
    const location = useLocation();
    const { publicCssRules } = useSelector((state) => state.settings);
    const pathname = location.pathname;

    const matchingCss = useMemo(() => {
        console.log("--- StyleInjector Check ---");
        console.log("Current Pathname:", pathname);
        console.log("All CSS Rules:", publicCssRules);

        if (!publicCssRules || publicCssRules.length === 0) {
            console.log("No rules found. Exiting.");
            return null;
        }

        // --- 1. البحث عن تطابق تام ---
        const exactMatch = publicCssRules.find(rule => rule.path === pathname);
        if (exactMatch) {
            console.log("Found Exact Match:", exactMatch);
            return exactMatch.css;
        }
        
        // --- 2. البحث عن تطابق ديناميكي ---
        const dynamicRules = publicCssRules.filter(rule => rule.path.includes(':'));
        console.log("Dynamic rules to check:", dynamicRules);

        for (const rule of dynamicRules) {
            const escapedPath = rule.path.replace(/\//g, '\\/'); 
            const regexPattern = `^${escapedPath.replace(/:\w+/g, '([^/]+)')}$`;
            
            console.log(`- Checking rule: "${rule.path}" with Regex: "${regexPattern}"`);

            try {
                const regex = new RegExp(regexPattern);
                const match = pathname.match(regex);
                
                if (match) {
                    console.log("SUCCESS: Dynamic match found!", { rule, pathname });
                    return rule.css;
                }
            } catch (e) {
                console.error("Error creating RegExp:", e);
            }
        }

        console.log("No exact or dynamic match found.");
        return null;
    }, [pathname, publicCssRules]);

    if (!matchingCss) {
        return null;
    }

    return (
        <GlobalStyles styles={matchingCss} />
    );
};

export default StyleInjector;