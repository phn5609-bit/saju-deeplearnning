import json
import os
import time

# --- Configuration & High CPC Database ---
KEYWORD_DB = [
    {
        "keyword": "Best car insurance in North Carolina",
        "target_cpc": "$220",
        "jurisdiction": "USA - North Carolina",
        "key_points": ["Safe Driver Incentive Plan (SDIP)", "State Minimums: 30/60/25", "Reinsurance Facility"]
    },
    {
        "keyword": "Mortgage Refinance Rates Texas 2026",
        "target_cpc": "$120",
        "jurisdiction": "USA - Texas",
        "key_points": ["Cash-out refinance limits", "Home equity rules", "Credit score impact"]
    }
]

class DeokBaeBlogEngine:
    def __init__(self, base_path):
        self.base_path = base_path
        self.output_dir = os.path.join(base_path, "output")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_post(self, data, lang="EN"):
        """
        [무결점 전문 HTML 엔진] 웹 브라우저 렌더링 100% 보장 버전
        """
        lang_titles = {
            "EN": f"{data['keyword']} (2026 Expert Financial Guide)",
            "JP": f"2026年 {data['keyword']} 究極の比較 - 最大40%節約の秘訣",
            "KO": f"2026년 {data['keyword']} 최저가 비교 및 혜택 총정리 (수익 보장 가이드)",
            "CN": f"2026年 {data['keyword']} 终极对比 - 节省40%成本的秘籍"
        }
        
        title = lang_titles.get(lang, lang_titles["EN"])
        print(f"🚀 [무결점 수술 중] '{title}' ({lang}) 제작 중...")
        
        # 전문 디자인 시스템 (Inline CSS)
        HERO_STYLE = 'display:flex;align-items:center;justify-content:center;height:300px;background:linear-gradient(135deg, #1a237e 0%, #4a148c 100%);color:white;border-radius:15px;margin-bottom:30px;text-align:center;padding:20px;font-family:sans-serif;'
        TABLE_STYLE = 'style="border-collapse:collapse;width:100%;font-size:0.95rem;color:#ffffff !important;margin:20px 0;background:#1a1a1a;border:1px solid #333;"'
        TH_STYLE = 'style="background:#333;padding:15px;color:#ffffff !important;border:1px solid #444;text-align:left;"'
        TD_STYLE = 'style="padding:12px;border:1px solid #333;color:#eeeeee !important;"'
        BANNER_STYLE = 'style="background:#f3e5f5;padding:25px;border-radius:15px;border-left:8px solid #9c27b0;margin:40px 0;color:#4a148c !important;box-shadow:0 4px 15px rgba(0,0,0,0.1);"'
        
        post_content = f"""
<div style="font-family:'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height:1.7; color:#f0f0f0; background:#000000; padding:20px;">
    <!-- Hero Section -->
    <div style="{HERO_STYLE}">
        <h1 style="margin:0;font-size:2.2rem;text-shadow:2px 2px 4px rgba(0,0,0,0.5);">{title}</h1>
    </div>

    <h2 style="color:#bb86fc;border-bottom:2px solid #bb86fc;padding-bottom:10px;">🏛️ Market Intelligence: {data['jurisdiction']}</h2>
    <p style="font-size:1.1rem;">In 2026, the strategy for <strong>{data['keyword']}</strong> has shifted toward data-driven optimization. Our analysis shows a significant opportunity for cost reduction and benefit maximization.</p>

    <h2 style="color:#03dac6;">📊 2026 Performance Metrics</h2>
    <table {TABLE_STYLE}>
        <thead>
            <tr {TH_STYLE}>
                <th>Key Factor</th>
                <th>Global Status</th>
                <th>Projected Benefit</th>
            </tr>
        </thead>
        <tbody>
"""
        for point in data['key_points']:
            post_content += f"""
            <tr>
                <td {TD_STYLE}><strong>{point}</strong></td>
                <td {TD_STYLE}>Optimized</td>
                <td {TD_STYLE}><span style="color:#ffeb3b;">+40% Efficiency</span></td>
            </tr>
"""
            
        post_content += f"""
        </tbody>
    </table>

    <!-- Saju Banner (Affiliate) -->
    <div {BANNER_STYLE}>
        <h3 style="margin-top:0;color:#4a148c !important;">🔮 오늘의 재물운과 행운의 숫자를 확인하세요!</h3>
        <p style="font-size:1.05rem;color:#4a148c !important;">명리학 AI가 당신의 생년월일로 분석한 <strong>2026년 대박 행운번호 5줄</strong>을 지금 즉시 무료로 확인하십시오.</p>
        <a href="https://saju-deep.com" target="_blank" style="display:inline-block;background:#7b1fa2;color:white !important;padding:12px 25px;border-radius:30px;text-decoration:none;font-weight:bold;margin-top:10px;">👉 무료 사주 분석 & 로또번호 받기</a>
    </div>

    <h2 style="color:#ff4081;">💰 Strategic Action</h2>
    <p>Based on our findings, immediate implementation of the optimized framework is recommended. Contact your local specialist for a customized transition plan.</p>
    
    <div style="background:#222;padding:20px;border-radius:10px;text-align:center;margin-top:40px;border:1px dashed #555;">
        <span style="color:#aaa;">[Affiliate Link: Secure Your 2026 Quote - $220.00 Bounty Eligible]</span>
    </div>
</div>
"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"post_{lang}_{data['keyword'].replace(' ', '_')}_{timestamp}.md" # Keeping extension for now, but content is HTML
        
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(post_content)
            
        return filepath

# --- Main Execution ---
if __name__ == "__main__":
    engine = DeokBaeBlogEngine(os.getcwd())
    for kw in KEYWORD_DB:
        for l in ["EN", "JP", "KO", "CN"]:
            path = engine.generate_post(kw, lang=l)
            print(f"✅ [{l}] 수익형 포스팅 배포 대기: {path}")
