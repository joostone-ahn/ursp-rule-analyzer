console.log('app.js loaded successfully');

// Global variables to track URSP structure (similar to PyQt implementation)
let urspSum = [];
let rsdSum = [];
let rsdConts = [];

// Helper function to get next available URSP precedence value
function getNextURSPPrecedence() {
    const usedValues = urspSum.map(ursp => parseInt(ursp.ursp_pv)).filter(val => !isNaN(val));
    let nextValue = 1;
    while (usedValues.includes(nextValue)) {
        nextValue++;
    }
    return nextValue.toString();
}

// Helper function to get next available RSD precedence value for a specific URSP
function getNextRSDPrecedence(urspIndex) {
    if (!rsdSum[urspIndex]) return '1';
    const usedValues = rsdSum[urspIndex].map(rsd => parseInt(rsd.rsd_pv)).filter(val => !isNaN(val));
    let nextValue = 1;
    while (usedValues.includes(nextValue)) {
        nextValue++;
    }
    return nextValue.toString();
}

// Initialize with default values (like PyQt)
function initializeDefaultURSP() {
    // Create default URSP rule (ursp_num = 0)
    urspSum = [{
        ursp_num: 'URSP_0',
        ursp_pv: '1',
        td_type: 'Match-all',
        td_val: '-',
        rsd_cnt: 1
    }];
    
    // Create default RSD (rsd_num = 0)
    rsdSum = [[{
        rsd_num: 'RSD_0_0',
        rsd_pv: '1',
        rsd_conts_cnt: 1
    }]];
    
    // Create default RSD Contents (rsd_conts_num = 0)
    rsdConts = [[[{
        rsd_conts_num: 'RSD_0_0_0',
        rsd_conts_type: 'SSC mode',
        rsd_conts_val: ''
    }]]];
    
    console.log('Default URSP structure initialized:', { urspSum, rsdSum, rsdConts });
}

// Create URSP card HTML
function createURSPCard(urspIndex) {
    const ursp = urspSum[urspIndex];
    let cardHTML = `
        <div class="ursp-card" data-ursp-index="${urspIndex}">
            <div class="ursp-card-header">URSP Rule ${urspIndex}</div>
            <div class="ursp-fields">
                <div class="field-group">
                    <label>Precedence Value</label>
                    <input type="text" value="${ursp.ursp_pv}" placeholder="Enter value" 
                           onchange="updateURSPValue(${urspIndex}, 'ursp_pv', this.value)">
                </div>
                <div class="field-group">
                    <label>Traffic Descriptor Type</label>
                    <select onchange="updateTDType(${urspIndex}, this.value)">
                        <option value="Match-all" ${ursp.td_type === 'Match-all' ? 'selected' : ''}>Match-all</option>
                        <option value="OS Id + OS App Id" ${ursp.td_type === 'OS Id + OS App Id' ? 'selected' : ''}>OS Id + OS App Id</option>
                        <option value="DNN" ${ursp.td_type === 'DNN' ? 'selected' : ''}>DNN</option>
                        <option value="Connection capabilities" ${ursp.td_type === 'Connection capabilities' ? 'selected' : ''}>Connection capabilities</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Traffic Descriptor Value</label>
                    ${ursp.td_type === 'Match-all' ? 
                        `<input type="text" value="${ursp.td_val}" disabled class="td-value-input">` :
                        ursp.td_type === 'Connection capabilities' ?
                        createConnectionCapabilitiesDropdown(urspIndex, ursp.td_val) :
                        `<input type="text" value="${ursp.td_val}" 
                               onchange="updateURSPValue(${urspIndex}, 'td_val', this.value)" class="td-value-input">`
                    }
                </div>
                <div class="field-group">
                    <label>RSD Count</label>
                    <input type="number" value="${ursp.rsd_cnt}" min="1" max="5" 
                           onchange="updateRSDCount(${urspIndex}, parseInt(this.value))">
                </div>
            </div>
            
            <div class="rsd-container">`;
    
    // Add RSD cards
    for (let rsdIndex = 0; rsdIndex < rsdSum[urspIndex].length; rsdIndex++) {
        cardHTML += createRSDCard(urspIndex, rsdIndex);
    }
    
    cardHTML += `</div></div>`;
    return cardHTML;
}

// Create RSD card HTML
function createRSDCard(urspIndex, rsdIndex) {
    console.log(`Creating RSD card: ${urspIndex}_${rsdIndex}`);
    
    // 안전성 검사
    if (!rsdSum[urspIndex] || !rsdSum[urspIndex][rsdIndex]) {
        console.error(`RSD not found: ${urspIndex}_${rsdIndex}`);
        return '';
    }
    
    const rsd = rsdSum[urspIndex][rsdIndex];
    console.log(`RSD data:`, rsd);
    
    let cardHTML = `
        <div class="rsd-card" data-rsd-index="${rsdIndex}">
            <div class="rsd-card-header">RSD ${urspIndex}_${rsdIndex}</div>
            <div class="rsd-card-content">
                <div class="rsd-fields-box">
                    <div class="field-group">
                        <label>Precedence Value</label>
                        <input type="text" value="${rsd.rsd_pv}" placeholder="Enter value" 
                               onchange="updateRSDValue(${urspIndex}, ${rsdIndex}, 'rsd_pv', this.value)">
                    </div>
                    <div class="field-group">
                        <label>RSD Type Count</label>
                        <input type="number" value="${rsd.rsd_conts_cnt}" min="1" max="5" 
                               onchange="updateRSDContentsCount(${urspIndex}, ${rsdIndex}, parseInt(this.value))">
                    </div>
                </div>
                
                <div class="rsd-types-container">
                    <div class="rsd-types-box">`;
    
    // Add RSD Contents cards - use the actual count from rsdConts array
    if (rsdConts[urspIndex] && rsdConts[urspIndex][rsdIndex] && Array.isArray(rsdConts[urspIndex][rsdIndex])) {
        const actualContentsCount = rsdConts[urspIndex][rsdIndex].length;
        console.log(`Creating RSD ${urspIndex}_${rsdIndex} with ${actualContentsCount} contents`);
        
        for (let contentsIndex = 0; contentsIndex < actualContentsCount; contentsIndex++) {
            if (rsdConts[urspIndex][rsdIndex][contentsIndex]) {
                const contentsCardHtml = createRSDContentsCard(urspIndex, rsdIndex, contentsIndex);
                if (contentsCardHtml) {
                    cardHTML += contentsCardHtml;
                } else {
                    console.error(`Failed to create RSD Contents card ${urspIndex}_${rsdIndex}_${contentsIndex}`);
                }
            } else {
                console.error(`RSD Contents ${urspIndex}_${rsdIndex}_${contentsIndex} is null/undefined`);
            }
        }
    } else {
        console.error(`Invalid rsdConts structure for ${urspIndex}_${rsdIndex}`);
    }
    
    cardHTML += `</div></div></div></div>`;
    return cardHTML;
}

// Create RSD Contents card HTML
function createRSDContentsCard(urspIndex, rsdIndex, contentsIndex) {
    console.log(`Creating RSD Contents card: ${urspIndex}_${rsdIndex}_${contentsIndex}`);
    
    // 더 강력한 안전성 검사
    if (!rsdConts || !Array.isArray(rsdConts)) {
        console.error('rsdConts is not an array');
        return '';
    }
    
    if (!rsdConts[urspIndex] || !Array.isArray(rsdConts[urspIndex])) {
        console.error(`rsdConts[${urspIndex}] is not an array`);
        return '';
    }
    
    if (!rsdConts[urspIndex][rsdIndex] || !Array.isArray(rsdConts[urspIndex][rsdIndex])) {
        console.error(`rsdConts[${urspIndex}][${rsdIndex}] is not an array`);
        return '';
    }
    
    if (!rsdConts[urspIndex][rsdIndex][contentsIndex]) {
        console.error(`RSD Contents not found: ${urspIndex}_${rsdIndex}_${contentsIndex}`);
        console.error(`Available contents:`, rsdConts[urspIndex][rsdIndex]);
        return '';
    }
    
    const contents = rsdConts[urspIndex][rsdIndex][contentsIndex];
    console.log(`Contents data:`, contents);
    
    // PyQt 구현에 따라 rsd_zero 타입들만 비활성화
    const rsdZeroTypes = [
        "Multi-access preference", 
        "Non-seamless non-3GPP offload indication",
        "5G ProSe layer-3 UE-to-network relay offload indication"
    ];
    
    const isDisabled = rsdZeroTypes.includes(contents.rsd_conts_type);
    
    return `
        <div class="rsd-contents-card" data-contents-index="${contentsIndex}">
            <div class="rsd-contents-header">RSD Type ${urspIndex}_${rsdIndex}_${contentsIndex}</div>
            <div class="rsd-contents-fields">
                <div class="field-group">
                    <label>Type</label>
                    <select onchange="updateRSDContentsType(${urspIndex}, ${rsdIndex}, ${contentsIndex}, this.value)">
                        <option value="SSC mode" ${contents.rsd_conts_type === 'SSC mode' ? 'selected' : ''}>SSC mode</option>
                        <option value="S-NSSAI" ${contents.rsd_conts_type === 'S-NSSAI' ? 'selected' : ''}>S-NSSAI</option>
                        <option value="DNN" ${contents.rsd_conts_type === 'DNN' ? 'selected' : ''}>DNN</option>
                        <option value="Access type" ${contents.rsd_conts_type === 'Access type' ? 'selected' : ''}>Access type</option>
                        <option value="Multi-access preference" ${contents.rsd_conts_type === 'Multi-access preference' ? 'selected' : ''}>Multi-access preference</option>
                        <option value="Non-seamless non-3GPP offload indication" ${contents.rsd_conts_type === 'Non-seamless non-3GPP offload indication' ? 'selected' : ''}>Non-seamless non-3GPP offload indication</option>
                        <option value="5G ProSe layer-3 UE-to-network relay offload indication" ${contents.rsd_conts_type === '5G ProSe layer-3 UE-to-network relay offload indication' ? 'selected' : ''}>5G ProSe layer-3 UE-to-network relay offload indication</option>
                        <option value="PDU session type" ${contents.rsd_conts_type === 'PDU session type' ? 'selected' : ''}>PDU session type</option>
                        <option value="Preferred access type" ${contents.rsd_conts_type === 'Preferred access type' ? 'selected' : ''}>Preferred access type</option>
                        <option value="PDU session pair ID" ${contents.rsd_conts_type === 'PDU session pair ID' ? 'selected' : ''}>PDU session pair ID</option>
                        <option value="RSN" ${contents.rsd_conts_type === 'RSN' ? 'selected' : ''}>RSN</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Value</label>
                    <input type="text" value="${contents.rsd_conts_val}" ${isDisabled ? 'disabled' : ''} 
                           placeholder="${isDisabled ? '-' : 'Enter value'}" class="rsd-value-input"
                           onchange="updateRSDContentsValue(${urspIndex}, ${rsdIndex}, ${contentsIndex}, this.value)">
                </div>
            </div>
        </div>
    `;
}

// Update functions
function updateURSPValue(urspIndex, field, value) {
    urspSum[urspIndex][field] = value;
    console.log('Updated URSP:', urspSum[urspIndex]);
}

// Connection Capabilities 옵션 정의 (3GPP 표준 기본 옵션만)
const connectionCapabilities = {
    'IMS': '01',
    'MMS': '02', 
    'SUPL': '04',
    'Internet': '08'
};

// Connection Capabilities 드롭다운 HTML 생성 함수
function createConnectionCapabilitiesDropdown(urspIndex, currentValue) {
    const currentValues = currentValue.split(', ').filter(v => v && v !== 'None selected');
    const selectedCount = currentValues.length;
    
    let checkboxesHTML = '';
    Object.keys(connectionCapabilities).forEach(capability => {
        const isChecked = currentValues.includes(capability) ? 'checked' : '';
        checkboxesHTML += `
            <label class="capability-checkbox">
                <input type="checkbox" value="${capability}" ${isChecked} 
                       onchange="updateConnectionCapabilitiesSelection(${urspIndex})">
                <span>${capability}</span>
            </label>
        `;
    });
    
    return `
        <div class="connection-capabilities-selector">
            <button type="button" class="capabilities-toggle-btn" onclick="toggleConnectionCapabilities(${urspIndex})">
                ▼ Capabilities <span class="capabilities-count">(${selectedCount} selected)</span>
            </button>
            <div class="connection-capabilities-dropdown" style="display: none;">
                ${checkboxesHTML}
            </div>
        </div>
    `;
}
// Connection Capabilities 토글 함수
function toggleConnectionCapabilities(urspIndex) {
    const container = document.querySelector(`[data-ursp-index="${urspIndex}"] .connection-capabilities-dropdown`);
    const toggleBtn = document.querySelector(`[data-ursp-index="${urspIndex}"] .capabilities-toggle-btn`);
    
    if (!container || !toggleBtn) return;
    
    const isVisible = container.style.display !== 'none';
    container.style.display = isVisible ? 'none' : 'block';
    
    // 버튼 텍스트에서 카운트 부분만 유지하고 화살표만 변경
    const countSpan = toggleBtn.querySelector('.capabilities-count');
    const countText = countSpan ? countSpan.outerHTML : '';
    toggleBtn.innerHTML = `${isVisible ? '▼' : '▲'} Capabilities ${countText}`;
}

// Connection Capabilities 선택 변경 처리
function updateConnectionCapabilitiesSelection(urspIndex) {
    const container = document.querySelector(`[data-ursp-index="${urspIndex}"] .connection-capabilities-dropdown`);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
    
    const selectedCapabilities = Array.from(checkboxes).map(cb => cb.value);
    const capabilitiesString = selectedCapabilities.join(', ');
    
    // URSP 데이터 업데이트
    urspSum[urspIndex].td_val = capabilitiesString || 'None selected';
    
    // 선택된 항목 수 표시
    const countDisplay = document.querySelector(`[data-ursp-index="${urspIndex}"] .capabilities-count`);
    countDisplay.textContent = `(${selectedCapabilities.length} selected)`;
    
    console.log(`Connection Capabilities: ${capabilitiesString}`);
}

function updateURSPValue(urspIndex, field, value) {
    urspSum[urspIndex][field] = value;
    console.log('Updated URSP:', urspSum[urspIndex]);
}

function updateTDType(urspIndex, value) {
    urspSum[urspIndex].td_type = value;
    if (value === 'Match-all') {
        urspSum[urspIndex].td_val = '-';
    } else if (value === 'OS Id + OS App Id') {
        urspSum[urspIndex].td_val = 'Android/OS_APP_Id';
    } else if (value === 'Connection capabilities') {
        urspSum[urspIndex].td_val = 'IMS, MMS, SUPL, Internet';
    } else {
        urspSum[urspIndex].td_val = '';
    }
    renderURSPCards();
}

function updateRSDValue(urspIndex, rsdIndex, field, value) {
    rsdSum[urspIndex][rsdIndex][field] = value;
    console.log('Updated RSD:', rsdSum[urspIndex][rsdIndex]);
}

function updateRSDContentsValue(urspIndex, rsdIndex, contentsIndex, value) {
    rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = value;
    console.log('Updated RSD Contents:', rsdConts[urspIndex][rsdIndex][contentsIndex]);
}

function updateRSDContentsType(urspIndex, rsdIndex, contentsIndex, value) {
    rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_type = value;
    
    // PyQt 구현에 따라 spec.rsd_zero 타입들만 비활성화
    const rsdZeroTypes = [
        "Multi-access preference", 
        "Non-seamless non-3GPP offload indication",
        "5G ProSe layer-3 UE-to-network relay offload indication"
    ];
    
    if (rsdZeroTypes.includes(value)) {
        rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = '-';
    } else {
        // 나머지 모든 타입(SSC mode 포함)은 사용자가 입력할 수 있음
        rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = '';
        if (value === 'S-NSSAI') {
            rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = 'SST 1 + SD 1';
        }
    }
    
    renderURSPCards();
}

function updateRSDCount(urspIndex, newCount) {
    const currentCount = rsdSum[urspIndex].length;
    
    if (newCount > currentCount) {
        // Add new RSD
        for (let i = currentCount; i < newCount; i++) {
            const nextPrecedence = getNextRSDPrecedence(urspIndex);
            rsdSum[urspIndex].push({
                rsd_num: `RSD_${urspIndex}_${i}`,
                rsd_pv: nextPrecedence,
                rsd_conts_cnt: 1
            });
            
            rsdConts[urspIndex].push([{
                rsd_conts_num: `RSD_${urspIndex}_${i}_0`,
                rsd_conts_type: 'SSC mode',
                rsd_conts_val: ''
            }]);
        }
    } else if (newCount < currentCount) {
        // Remove RSD
        rsdSum[urspIndex].splice(newCount);
        rsdConts[urspIndex].splice(newCount);
    }
    
    urspSum[urspIndex].rsd_cnt = newCount;
    renderURSPCards();
}

function updateRSDContentsCount(urspIndex, rsdIndex, newCount) {
    console.log(`=== updateRSDContentsCount START ===`);
    console.log(`Parameters: urspIndex=${urspIndex}, rsdIndex=${rsdIndex}, newCount=${newCount}`);
    console.log(`Current rsdConts structure:`, JSON.stringify(rsdConts, null, 2));
    
    // 더 강력한 안전성 검사
    if (!rsdConts || !Array.isArray(rsdConts)) {
        console.error('rsdConts is not an array:', rsdConts);
        return;
    }
    
    if (!rsdConts[urspIndex]) {
        console.error(`rsdConts[${urspIndex}] does not exist`);
        return;
    }
    
    if (!Array.isArray(rsdConts[urspIndex])) {
        console.error(`rsdConts[${urspIndex}] is not an array:`, rsdConts[urspIndex]);
        return;
    }
    
    if (!rsdConts[urspIndex][rsdIndex]) {
        console.error(`rsdConts[${urspIndex}][${rsdIndex}] does not exist`);
        return;
    }
    
    if (!Array.isArray(rsdConts[urspIndex][rsdIndex])) {
        console.error(`rsdConts[${urspIndex}][${rsdIndex}] is not an array:`, rsdConts[urspIndex][rsdIndex]);
        return;
    }
    
    const currentCount = rsdConts[urspIndex][rsdIndex].length;
    console.log(`Current count: ${currentCount}, New count: ${newCount}`);
    
    try {
        if (newCount > currentCount) {
            // Add new RSD Contents
            console.log(`Adding ${newCount - currentCount} new RSD Contents`);
            for (let i = currentCount; i < newCount; i++) {
                console.log(`Creating RSD Contents ${i}`);
                const newContent = {
                    rsd_conts_num: `RSD_${urspIndex}_${rsdIndex}_${i}`,
                    rsd_conts_type: 'SSC mode',
                    rsd_conts_val: ''
                };
                
                // 배열에 추가하기 전에 다시 한번 확인
                if (!Array.isArray(rsdConts[urspIndex][rsdIndex])) {
                    console.error(`Array became invalid during loop at index ${i}`);
                    return;
                }
                
                rsdConts[urspIndex][rsdIndex].push(newContent);
                console.log(`Successfully added content ${i}:`, newContent);
                console.log(`Array length after adding: ${rsdConts[urspIndex][rsdIndex].length}`);
            }
        } else if (newCount < currentCount) {
            // Remove RSD Contents
            console.log(`Removing ${currentCount - newCount} RSD Contents`);
            const removed = rsdConts[urspIndex][rsdIndex].splice(newCount);
            console.log(`Removed contents:`, removed);
            console.log(`Array length after removing: ${rsdConts[urspIndex][rsdIndex].length}`);
        }
        
        // Update the count in rsdSum
        if (rsdSum[urspIndex] && rsdSum[urspIndex][rsdIndex]) {
            rsdSum[urspIndex][rsdIndex].rsd_conts_cnt = newCount;
            console.log(`Updated rsdSum count to: ${newCount}`);
        } else {
            console.error('rsdSum structure invalid');
        }
        
        console.log('Final rsdConts state:', JSON.stringify(rsdConts[urspIndex][rsdIndex], null, 2));
        console.log('Final rsdSum state:', JSON.stringify(rsdSum[urspIndex][rsdIndex], null, 2));
        
        // 데이터 무결성 검증
        const finalCount = rsdConts[urspIndex][rsdIndex].length;
        if (finalCount !== newCount) {
            console.error(`Data integrity check failed! Expected: ${newCount}, Actual: ${finalCount}`);
        } else {
            console.log(`Data integrity check passed: ${finalCount} items`);
        }
        
        console.log(`=== updateRSDContentsCount END ===`);
        
        // 렌더링 전에 잠시 대기
        setTimeout(() => {
            console.log('Starting re-render...');
            renderURSPCards();
        }, 50);
        
    } catch (error) {
        console.error('Error in updateRSDContentsCount:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Render all URSP cards
function renderURSPCards() {
    console.log('=== renderURSPCards START ===');
    console.log('Current data structures:');
    console.log('urspSum:', JSON.stringify(urspSum, null, 2));
    console.log('rsdSum:', JSON.stringify(rsdSum, null, 2));
    console.log('rsdConts:', JSON.stringify(rsdConts, null, 2));
    
    const container = document.getElementById('ursp-container');
    if (!container) {
        console.error('URSP container not found');
        return;
    }
    
    try {
        let html = '';
        for (let i = 0; i < urspSum.length; i++) {
            console.log(`Rendering URSP card ${i}`);
            const cardHtml = createURSPCard(i);
            if (cardHtml) {
                html += cardHtml;
            } else {
                console.error(`Failed to create URSP card ${i}`);
            }
        }
        
        container.innerHTML = html;
        console.log('URSP cards rendered successfully');
        console.log('=== renderURSPCards END ===');
    } catch (error) {
        console.error('Error in renderURSPCards:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Handle URSP count changes
function handleURSPCountChange(newCount) {
    const currentCount = urspSum.length;
    
    if (newCount > currentCount) {
        // Add new URSP rules
        for (let i = currentCount; i < newCount; i++) {
            const nextPrecedence = getNextURSPPrecedence();
            urspSum.push({
                ursp_num: `URSP_${i}`,
                ursp_pv: nextPrecedence,
                td_type: 'Match-all',
                td_val: '-',
                rsd_cnt: 1
            });
            
            const nextRSDPrecedence = getNextRSDPrecedence(i);
            rsdSum.push([{
                rsd_num: `RSD_${i}_0`,
                rsd_pv: nextRSDPrecedence,
                rsd_conts_cnt: 1
            }]);
            
            rsdConts.push([[{
                rsd_conts_num: `RSD_${i}_0_0`,
                rsd_conts_type: 'SSC mode',
                rsd_conts_val: ''
            }]]);
        }
    } else if (newCount < currentCount) {
        // Remove URSP rules
        urspSum.splice(newCount);
        rsdSum.splice(newCount);
        rsdConts.splice(newCount);
    }
    
    renderURSPCards();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready in app.js');
    
    // Initialize default URSP structure
    initializeDefaultURSP();
    
    // Render initial cards
    renderURSPCards();
    
    // Setup URSP count change listener
    const urspCountInput = document.getElementById('ursp-count');
    if (urspCountInput) {
        urspCountInput.addEventListener('change', function() {
            const newCount = parseInt(this.value);
            console.log('URSP count changed to:', newCount);
            handleURSPCountChange(newCount);
        });
        console.log('URSP count listener added');
    } else {
        console.error('ursp-count input not found');
    }
    
    // Setup event delegation for dynamic RSD and Contents count changes
    const container = document.getElementById('ursp-container');
    if (container) {
        container.addEventListener('change', function(event) {
            const target = event.target;
            console.log('Change event detected:', target.type, target.value);
            
            // Handle RSD count changes (in URSP fields)
            if (target.type === 'number' && target.closest('.ursp-fields')) {
                const urspCard = target.closest('.ursp-card');
                const urspIndex = parseInt(urspCard.getAttribute('data-ursp-index'));
                const newRSDCount = parseInt(target.value);
                console.log(`RSD count changed for URSP ${urspIndex} to:`, newRSDCount);
                updateRSDCount(urspIndex, newRSDCount);
            }
            
            // Handle Contents count changes (in RSD fields)
            else if (target.type === 'number' && target.closest('.rsd-fields')) {
                const rsdCard = target.closest('.rsd-card');
                const urspCard = target.closest('.ursp-card');
                const urspIndex = parseInt(urspCard.getAttribute('data-ursp-index'));
                const rsdIndex = parseInt(rsdCard.getAttribute('data-rsd-index'));
                const newContentsCount = parseInt(target.value);
                console.log(`Contents count changed for URSP ${urspIndex}, RSD ${rsdIndex} to:`, newContentsCount);
                updateRSDContentsCount(urspIndex, rsdIndex, newContentsCount);
            }
        });
        
        // Also handle select changes for TD Type and RSD Type
        container.addEventListener('change', function(event) {
            const target = event.target;
            
            // Handle Traffic Descriptor Type changes
            if (target.tagName === 'SELECT' && target.closest('.ursp-fields')) {
                const urspCard = target.closest('.ursp-card');
                const urspIndex = parseInt(urspCard.getAttribute('data-ursp-index'));
                console.log(`TD Type changed for URSP ${urspIndex} to:`, target.value);
                updateTDType(urspIndex, target.value);
            }
            
            // Handle RSD Contents Type changes
            else if (target.tagName === 'SELECT' && target.closest('.rsd-contents-fields')) {
                const contentsCard = target.closest('.rsd-contents-card');
                const rsdCard = target.closest('.rsd-card');
                const urspCard = target.closest('.ursp-card');
                const urspIndex = parseInt(urspCard.getAttribute('data-ursp-index'));
                const rsdIndex = parseInt(rsdCard.getAttribute('data-rsd-index'));
                const contentsIndex = parseInt(contentsCard.getAttribute('data-contents-index'));
                console.log(`RSD Type changed for URSP ${urspIndex}, RSD ${rsdIndex}, Contents ${contentsIndex} to:`, target.value);
                updateRSDContentsType(urspIndex, rsdIndex, contentsIndex, target.value);
            }
        });
        console.log('Event delegation setup completed');
    } else {
        console.error('ursp-container not found');
    }
    
    // Setup tab functionality
    setupTabs();
    
    // Setup encode button
    setupEncodeButton();
    
    // Setup decode button
    setupDecodeButton();
});

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// Encode button functionality
function setupEncodeButton() {
    const encodeBtn = document.getElementById('encode-btn');
    const encodeStatus = document.getElementById('encode-status');
    
    if (encodeBtn) {
        let isEncoding = false; // Flag to prevent multiple requests
        
        encodeBtn.addEventListener('click', async function() {
            // Prevent multiple clicks
            if (isEncoding) {
                console.log('Encoding already in progress, ignoring click');
                return;
            }
            
            isEncoding = true;
            encodeBtn.disabled = true;
            
            encodeStatus.textContent = 'Encoding...';
            encodeStatus.className = 'status-message';
            
            try {
                // Sync data from HTML inputs to ensure we have the latest values
                syncDataFromHTML();
                
                // Validate that all required fields have values
                for (let i = 0; i < urspSum.length; i++) {
                    if (!urspSum[i].ursp_pv || urspSum[i].ursp_pv.trim() === '') {
                        throw new Error(`URSP Rule ${i}: Precedence Value is required`);
                    }
                }
                
                for (let i = 0; i < rsdSum.length; i++) {
                    for (let j = 0; j < rsdSum[i].length; j++) {
                        if (!rsdSum[i][j].rsd_pv || rsdSum[i][j].rsd_pv.trim() === '') {
                            throw new Error(`RSD ${i}_${j}: Precedence Value is required`);
                        }
                    }
                }
                
                for (let i = 0; i < rsdConts.length; i++) {
                    for (let j = 0; j < rsdConts[i].length; j++) {
                        for (let k = 0; k < rsdConts[i][j].length; k++) {
                            const content = rsdConts[i][j][k];
                            // Only validate non-disabled fields
                            const rsdZeroTypes = [
                                "Multi-access preference", 
                                "Non-seamless non-3GPP offload indication",
                                "5G ProSe layer-3 UE-to-network relay offload indication"
                            ];
                            
                            if (!rsdZeroTypes.includes(content.rsd_conts_type)) {
                                if (!content.rsd_conts_val || content.rsd_conts_val.trim() === '') {
                                    throw new Error(`RSD Type ${i}_${j}_${k} (${content.rsd_conts_type}): Value is required`);
                                }
                            }
                        }
                    }
                }
                
                // Convert data to the format expected by encoder.py
                const ursp_sum_converted = urspSum.map(ursp => [
                    ursp.ursp_num,
                    ursp.ursp_pv,
                    ursp.td_type,
                    ursp.td_val,
                    ursp.rsd_cnt
                ]);
                
                const rsd_sum_converted = rsdSum.map(rsdArray => 
                    rsdArray.map(rsd => [
                        rsd.rsd_num,
                        rsd.rsd_pv,
                        rsd.rsd_conts_cnt
                    ])
                );
                
                const rsd_conts_converted = rsdConts.map(rsdContArray =>
                    rsdContArray.map(contArray =>
                        contArray.map(cont => [
                            cont.rsd_conts_num,
                            cont.rsd_conts_type,
                            cont.rsd_conts_val
                        ])
                    )
                );
                
                const data = {
                    pti: document.getElementById('pti').value,
                    plmn: document.getElementById('plmn').value,
                    upsc: document.getElementById('upsc').value,
                    ursp_sum: ursp_sum_converted,
                    rsd_sum: rsd_sum_converted,
                    rsd_conts: rsd_conts_converted
                };
                
                const response = await fetch('/encode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    encodeStatus.textContent = 'Encoding completed successfully!';
                    encodeStatus.className = 'status-message success';
                    
                    // Display results in Result tab
                    displayResults(result);
                    
                    // Switch to Result tab
                    document.querySelector('[data-tab="result"]').click();
                } else {
                    encodeStatus.textContent = 'Error: ' + result.error;
                    encodeStatus.className = 'status-message error';
                }
            } catch (error) {
                encodeStatus.textContent = 'Network error: ' + error.message;
                encodeStatus.className = 'status-message error';
            } finally {
                // Re-enable button and reset flag
                isEncoding = false;
                setTimeout(() => {
                    encodeBtn.disabled = false;
                }, 1000);
            }
        });
    }
}

// Sync data from HTML inputs to ensure we have the latest values
function syncDataFromHTML() {
    // Sync URSP data
    const urspCards = document.querySelectorAll('.ursp-card');
    urspCards.forEach((card, urspIndex) => {
        const urspFields = card.querySelector('.ursp-fields');
        if (urspFields) {
            const pvInput = urspFields.querySelector('input[type="text"]');
            if (pvInput && urspSum[urspIndex]) {
                urspSum[urspIndex].ursp_pv = pvInput.value || '1';
            }
        }
    });
    
    // Sync RSD data
    const rsdCards = document.querySelectorAll('.rsd-card');
    rsdCards.forEach((card) => {
        const urspCard = card.closest('.ursp-card');
        if (!urspCard) return;
        
        const urspIndex = parseInt(urspCard.getAttribute('data-ursp-index'));
        const rsdIndex = parseInt(card.getAttribute('data-rsd-index'));
        
        if (isNaN(urspIndex) || isNaN(rsdIndex)) return;
        
        // Try multiple ways to find the RSD precedence input
        let rsdPvInput = null;
        const allInputs = card.querySelectorAll('input[type="text"]');
        
        allInputs.forEach((input) => {
            if (input.getAttribute('onchange') && input.getAttribute('onchange').includes('updateRSDValue')) {
                rsdPvInput = input;
            }
        });
        
        // Fallback: try the first input in rsd-fields-box
        if (!rsdPvInput) {
            const rsdFieldsBox = card.querySelector('.rsd-fields-box');
            if (rsdFieldsBox) {
                const fieldGroups = rsdFieldsBox.querySelectorAll('.field-group');
                if (fieldGroups.length >= 1) {
                    rsdPvInput = fieldGroups[0].querySelector('input[type="text"]');
                }
            }
        }
        
        if (rsdPvInput && rsdSum[urspIndex] && rsdSum[urspIndex][rsdIndex]) {
            const value = rsdPvInput.value || '1';
            rsdSum[urspIndex][rsdIndex].rsd_pv = value;
        }
        
        // Sync RSD contents values
        const contentsCards = card.querySelectorAll('.rsd-contents-card');
        contentsCards.forEach((contCard) => {
            const contIndex = parseInt(contCard.getAttribute('data-contents-index'));
            if (isNaN(contIndex)) return;
            
            const contentsInputs = contCard.querySelectorAll('input[type="text"]');
            let valueInput = null;
            if (contentsInputs.length >= 2) {
                valueInput = contentsInputs[1];
            } else if (contentsInputs.length === 1) {
                valueInput = contentsInputs[0];
            }
            
            if (valueInput && rsdConts[urspIndex] && rsdConts[urspIndex][rsdIndex] && rsdConts[urspIndex][rsdIndex][contIndex]) {
                const currentValue = valueInput.value;
                
                if (!valueInput.disabled) {
                    rsdConts[urspIndex][rsdIndex][contIndex].rsd_conts_val = currentValue || '1';
                } else {
                    rsdConts[urspIndex][rsdIndex][contIndex].rsd_conts_val = '-';
                }
            }
        });
    });
}

// Decode button functionality
function setupDecodeButton() {
    const decodeBtn = document.getElementById('decode-btn');
    const decodeStatus = document.getElementById('decode-status');
    
    if (decodeBtn) {
        decodeBtn.addEventListener('click', async function() {
            const logText = document.getElementById('log-text').value;
            
            if (!logText.trim()) {
                decodeStatus.textContent = 'Please enter hex log data';
                decodeStatus.className = 'status-message error';
                return;
            }
            
            decodeStatus.textContent = 'Decoding...';
            decodeStatus.className = 'status-message';
            
            try {
                const response = await fetch('/decode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ log_text: logText })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    decodeStatus.textContent = 'Decoding completed successfully!';
                    decodeStatus.className = 'status-message success';
                    
                    if (result.message_type === 'DL NAS Transport') {
                        // Display results in Result tab
                        displayResults(result);
                        
                        // Switch to Result tab
                        document.querySelector('[data-tab="result"]').click();
                    } else {
                        // Display info message
                        document.getElementById('result-text').value = result.info || result.usi_result || 'Decoding completed';
                        document.querySelector('[data-tab="result"]').click();
                    }
                } else {
                    decodeStatus.textContent = 'Error: ' + result.error;
                    decodeStatus.className = 'status-message error';
                }
            } catch (error) {
                decodeStatus.textContent = 'Network error: ' + error.message;
                decodeStatus.className = 'status-message error';
            }
        });
    }
}

// Display results in Result tab
function displayResults(result) {
    const resultSections = document.getElementById('result-sections');
    
    if (!resultSections) {
        console.error('result-sections element not found');
        return;
    }
    
    let output = '';
    
    // Create grid container for EF_URSP and DL_NAS side by side
    if (result.ef_ursp || result.dl_nas) {
        output += '<div class="result-sections-grid">';
        
        if (result.ef_ursp) {
            output += '<div class="result-section-card">';
            output += '<div class="result-section-header ef-ursp">';
            output += '<span>SIM EF_URSP</span>';
            output += '<button class="copy-btn" onclick="copyResultText(this, \'' + escapeForJS(result.ef_ursp) + '\')">📋 Copy</button>';
            output += '</div>';
            output += '<div class="result-section-content">';
            output += '<div class="hex-display">' + result.ef_ursp + '</div>';
            output += '</div></div>';
        }
        
        if (result.dl_nas) {
            output += '<div class="result-section-card">';
            output += '<div class="result-section-header dl-nas">';
            output += '<span>DL NAS TRANSPORT</span>';
            output += '<button class="copy-btn" onclick="copyResultText(this, \'' + escapeForJS(result.dl_nas) + '\')">📋 Copy</button>';
            output += '</div>';
            output += '<div class="result-section-content">';
            output += '<div class="hex-display">' + result.dl_nas + '</div>';
            output += '</div></div>';
        }
        
        output += '</div>';
    }
    
    if (result.ursp_info) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header ursp-rule">';
        output += '<span>URSP RULE</span>';
        output += '<button class="copy-btn" onclick="copyResultText(this, \'' + escapeForJS(result.ursp_info + '\n\n' + result.ursp_conts) + '\')">📋 Copy</button>';
        output += '</div>';
        output += '<div class="result-section-content">';
        output += '<div class="text-display">' + result.ursp_info + '\n\n' + result.ursp_conts + '</div>';
        output += '</div></div>';
    }
    
    if (result.pol_cmd_txt) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header policy-command">';
        output += '<span>MANAGE UE POLICY COMMAND</span>';
        output += '<button class="copy-btn" onclick="copyResultText(this, \'' + escapeForJS(result.pol_cmd_txt) + '\')">📋 Copy</button>';
        output += '</div>';
        output += '<div class="result-section-content">';
        output += '<div class="text-display">' + result.pol_cmd_txt + '</div>';
        output += '</div></div>';
    }
    
    resultSections.innerHTML = output;
}

// Helper function to escape text for JavaScript string
function escapeForJS(text) {
    return text.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// Function to copy result text
function copyResultText(button, text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show temporary success message
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success message
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// Function to copy hex data without formatting
function copyHexData(hexString) {
    // Remove all spaces and formatting, keep only hex characters
    const cleanHex = hexString.replace(/\s+/g, '').replace(/[^0-9A-Fa-f]/g, '');
    
    navigator.clipboard.writeText(cleanHex).then(function() {
        // Show temporary success message
        const event = new CustomEvent('showToast', {
            detail: { message: 'Hex data copied to clipboard!', type: 'success' }
        });
        document.dispatchEvent(event);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = cleanHex;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const event = new CustomEvent('showToast', {
            detail: { message: 'Hex data copied to clipboard!', type: 'success' }
        });
        document.dispatchEvent(event);
    });
}