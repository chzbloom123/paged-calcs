
import React, { useState, useMemo } from 'react';

// --- Helper: Convert Decimal to 16ths Fraction ---
function toFraction(decimal: number): string {
    if (decimal === 0) return '0"';
    const whole = Math.floor(decimal);
    const remainder = decimal - whole;
    const sixteenths = Math.round(remainder * 16);
    
    if (sixteenths === 0) return `${whole}"`;
    if (sixteenths === 16) return `${whole + 1}"`;

    let num = sixteenths;
    let den = 16;
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const common = gcd(num, den);
    
    return `${whole > 0 ? whole + ' ' : ''}${num/common}/${den/common}"`;
}

// --- Calculator Component ---
const CalculatorCard = ({ title, formula, children, outputLabel, value, isVolume = false }: any) => (
    <div className="calculator">
        <h2>{title}</h2>
        <div className="formula">{formula}</div>
        <div className="space-y-4">
            {children}
        </div>
        <div className="output mt-6">
            <div>
                <span className="output-label text-xs uppercase text-neutral-500">{outputLabel}</span>
                <span className="fraction-text block font-bold text-lg text-neutral-300">
                    {isVolume ? 'Gallons' : toFraction(value)}
                </span>
            </div>
            <div className="output-value text-3xl font-bold text-[#00ff9f]">
                {value.toFixed(isVolume ? 2 : 3)}
            </div>
        </div>
    </div>
);

export default function App() {
    const [activePage, setActivePage] = useState<'fitter' | 'fluid'>('fitter');

    // Fitter Math States
    const [offset45, setOffset45] = useState(0);
    const [rollH, setRollH] = useState(0);
    const [rollV, setRollV] = useState(0);
    const [volID, setVolID] = useState(0);
    const [volLen, setVolLen] = useState(0);
    const [bendRad, setBendRad] = useState(0);
    const [pipeC2C, setPipeC2C] = useState(0);
    const [pipeTake1, setPipeTake1] = useState(0);
    const [pipeTake2, setPipeTake2] = useState(0);
    const [triA, setTriA] = useState(0);
    const [triB, setTriB] = useState(0);

    // Fluid Math States
    const [gpm, setGpm] = useState(0);
    const [fluidID, setFluidID] = useState(0);
    const [tempF, setTempF] = useState(70);
    const [pressure, setPressure] = useState(0);

    // Calculations
    const travel45 = offset45 * 1.4142;
    const rollTravel = Math.sqrt(rollH ** 2 + rollV ** 2) * 1.4142;
    const pipeVol = 0.0408 * (volID ** 2) * volLen;
    const bendGain = (2 * bendRad) - (1.5708 * bendRad);
    const cutLength = pipeC2C - pipeTake1 - pipeTake2;
    const triHyp = Math.sqrt(triA ** 2 + triB ** 2);

    // Fluid Calculations
    const velocity = fluidID > 0 ? (0.408 * gpm) / (fluidID ** 2) : 0;
    const waterWeight = 0.34 * (fluidID ** 2) * volLen; // lbs per foot simplified
    const surfaceArea = (Math.PI * fluidID * (volLen * 12)) / 144; // sq ft

    return (
        <div className="min-h-screen">
            <header>
                <div className="header-content flex flex-col md:flex-row items-center justify-between">
                    <div className="header-left flex items-center">
                        <img src="logo.png" alt="Cannon Bloom Logo" className="logo-left h-24 md:h-32" />
                    </div>
                    <div className="header-center py-4">
                        <h1 className="text-2xl md:text-5xl">FITTER MATH</h1>
                        <div className="nav-buttons flex justify-center gap-4 mt-6">
                            <button 
                                onClick={() => setActivePage('fitter')}
                                className={`px-6 py-2 border-2 transition-all font-bold tracking-widest uppercase text-xs
                                    ${activePage === 'fitter' 
                                        ? 'bg-[#00ff9f] text-black border-[#00ff9f] shadow-[0_0_15px_rgba(0,255,159,0.5)]' 
                                        : 'bg-transparent text-[#00ff9f] border-neutral-700 hover:border-[#00ff9f]'}`}
                            >
                                Fitter Math
                            </button>
                            <button 
                                onClick={() => setActivePage('fluid')}
                                className={`px-6 py-2 border-2 transition-all font-bold tracking-widest uppercase text-xs
                                    ${activePage === 'fluid' 
                                        ? 'bg-[#00ff9f] text-black border-[#00ff9f] shadow-[0_0_15px_rgba(0,255,159,0.5)]' 
                                        : 'bg-transparent text-[#00ff9f] border-neutral-700 hover:border-[#00ff9f]'}`}
                            >
                                Fluid Math
                            </button>
                        </div>
                    </div>
                    <div className="header-right hidden lg:flex gap-4">
                        <img src="seal1.jpg" alt="Radiation Symbol" className="seal h-24 w-24" />
                        <img src="seal2.jpg" alt="UA Local 598 Pasco WA Union Seal" className="seal h-24 w-24" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="calculator-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activePage === 'fitter' ? (
                        <>
                            <CalculatorCard title="45° Offset" formula="Travel = Offset × 1.414" outputLabel="Travel" value={travel45}>
                                <div className="input-group">
                                    <label>Offset (inches)</label>
                                    <input type="number" value={offset45 || ''} onChange={e => setOffset45(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Rolling Offset" formula="Travel = √(H² + V²) × 1.414" outputLabel="Travel" value={rollTravel}>
                                <div className="input-group">
                                    <label>Horizontal Offset</label>
                                    <input type="number" value={rollH || ''} onChange={e => setRollH(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Vertical Offset</label>
                                    <input type="number" value={rollV || ''} onChange={e => setRollV(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Pipe Volume" formula="Gallons = 0.0408 × D² × Length(ft)" outputLabel="Volume" value={pipeVol} isVolume={true}>
                                <div className="input-group">
                                    <label>Inside Diameter (inches)</label>
                                    <input type="number" value={volID || ''} onChange={e => setVolID(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Length (feet)</label>
                                    <input type="number" value={volLen || ''} onChange={e => setVolLen(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="90° Bend Gain" formula="Gain = (2 × R) - (1.5708 × R)" outputLabel="Gain" value={bendGain}>
                                <div className="input-group">
                                    <label>Bend Radius (inches)</label>
                                    <input type="number" value={bendRad || ''} onChange={e => setBendRad(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Pipe Length with Fittings" formula="Length = C-to-C - Total Takeout" outputLabel="Cut Length" value={cutLength}>
                                <div className="input-group">
                                    <label>Center-to-Center (inches)</label>
                                    <input type="number" value={pipeC2C || ''} onChange={e => setPipeC2C(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Fitting Takeout 1 (inches)</label>
                                    <input type="number" value={pipeTake1 || ''} onChange={e => setPipeTake1(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Fitting Takeout 2 (inches)</label>
                                    <input type="number" value={pipeTake2 || ''} onChange={e => setPipeTake2(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Right Triangle" formula="c = √(a² + b²)" outputLabel="Hypotenuse" value={triHyp}>
                                <div className="input-group">
                                    <label>Side A (inches)</label>
                                    <input type="number" value={triA || ''} onChange={e => setTriA(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Side B (inches)</label>
                                    <input type="number" value={triB || ''} onChange={e => setTriB(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>
                        </>
                    ) : (
                        <>
                            <CalculatorCard title="Flow Velocity" formula="V = (0.408 × GPM) / D²" outputLabel="Velocity (ft/s)" value={velocity} isVolume={true}>
                                <div className="input-group">
                                    <label>Flow Rate (GPM)</label>
                                    <input type="number" value={gpm || ''} onChange={e => setGpm(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Pipe ID (inches)</label>
                                    <input type="number" value={fluidID || ''} onChange={e => setFluidID(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Water Weight" formula="Weight = 0.34 × D² × L (lbs/ft)" outputLabel="Total Weight (lbs)" value={waterWeight} isVolume={true}>
                                <div className="input-group">
                                    <label>Pipe ID (inches)</label>
                                    <input type="number" value={fluidID || ''} onChange={e => setFluidID(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Length (feet)</label>
                                    <input type="number" value={volLen || ''} onChange={e => setVolLen(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>

                            <CalculatorCard title="Surface Area" formula="A = π × D × L" outputLabel="Surface Area (sq ft)" value={surfaceArea} isVolume={true}>
                                <div className="input-group">
                                    <label>Outer Diameter (inches)</label>
                                    <input type="number" value={fluidID || ''} onChange={e => setFluidID(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                                <div className="input-group">
                                    <label>Length (feet)</label>
                                    <input type="number" value={volLen || ''} onChange={e => setVolLen(parseFloat(e.target.value) || 0)} placeholder="0.00" />
                                </div>
                            </CalculatorCard>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
