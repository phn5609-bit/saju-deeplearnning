import os
import json
import datetime

# [CONFIG] ALPHA-NAM STYLE HTML TEMPLATE
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | 명리학 딥러닝</title>
    <link rel="stylesheet" href="../style.css?v=11">
    <style>
        .post-container {{ max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.9; color: var(--text-secondary); }}
        .funnel-box {{ background: linear-gradient(145deg, rgba(212,175,55,0.1), rgba(0,0,0,0.2)); padding: 30px; border-radius: 20px; border: 1px solid var(--accent-color); margin: 30px 0; text-align: center; }}
        .table-compare {{ width: 100%; border-collapse: collapse; margin: 30px 0; background: rgba(255,255,255,0.02); }}
        .table-compare th, .table-compare td {{ border: 1px solid var(--glass-border); padding: 15px; text-align: center; }}
        .table-compare th {{ background: rgba(212,175,55,0.2); color: var(--accent-color); }}
        .faq-item {{ background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 15px; }}
        .highlight {{ color: var(--accent-hover); font-weight: bold; }}
    </style>
</head>
<body>
    <div class="dashboard-container">
        <main class="panel post-container">
            <a href="../blog.html" style="color:var(--accent-sub); text-decoration:none;">← 목록으로</a>
            <div style="margin-top:20px; color:#666; font-size:0.9rem;">작성일: {date} | 카테고리: {category}</div>
            <h1>{title}</h1>
            
            <p>{intro}</p>

            <div class="funnel-box">
                <h3>👇 지금 내 위치 주변 {keyword} 전문가 실시간 추천</h3>
                <p>기다리지 말고 실시간으로 사주/궁합 전문가를 연결해 드립니다.</p>
                <a href="../index.html" class="cta-button">실시간 상담 가능 여부 확인 (무료)</a>
            </div>

            <h2>{subtitle1}</h2>
            {content1}

            <h2>📊 {table_title}</h2>
            <table class="table-compare">
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>특징</th>
                        <th>추천도</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>

            <h2>{subtitle2}</h2>
            {content2}

            <div class="faq-section">
                <h3>자주 묻는 질문 (FAQ)</h3>
                {faqs}
            </div>

            <div class="funnel-box" style="background:rgba(212,175,55,0.05);">
                <h3>💰 사주 상담 전, 나의 '재물 기운' 무료 측정하기</h3>
                <p>AI 딥러닝 엔진이 당신의 오늘 운세를 먼저 분석해 드립니다.</p>
                <a href="../index.html" class="cta-button">무료 분석 시작하기</a>
            </div>
        </main>
    </div>
</body>
</html>
"""

def save_post(filename, content):
    path = os.path.join("c:\\Users\\Admin\\초보프로젝트\\saju_lotto\\blog", filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[SUCCESS] Post saved: {path}")

# 이 스크립트는 향후 Gemini API와 연동하여 실제 데이터를 채우는 용도로 확장됩니다.
# 우선 템플릿과 기본 로직을 구축합니다.

if __name__ == "__main__":
    today = datetime.datetime.now().strftime("%Y.%m.%d")
    
    # 샘플 자동 생성 데이터 (테스트용)
    sample_data = {
        "title": "부산 용한 사주 철학관 가격 및 후기 비교 베스트 3 (2026 업데이트)",
        "date": today,
        "category": "지역 밀착 정보",
        "keyword": "부산 사주",
        "intro": "부산 서면과 해운대 일대에서 용하기로 소문난 곳들, 실제로 가면 얼마일까요? 광고가 아닌 실방문 데이터로 정리했습니다.",
        "subtitle1": "1. 서면 vs 해운대, 사주 성지는 어디?",
        "content1": "<p>부산은 전통적으로 서면 만물시장 인근과 해운대 센텀시티 권역으로 상담 스타일이 나뉩니다. 서면은 정통 명리학, 해운대는 현대적 심리 상담이 강세입니다.</p>",
        "table_title": "부산 주요 권역별 상담 특징 비교",
        "table_rows": "<tr><td>서면 권역</td><td>정통 명리학, 작명 강세</td><td>★★★★★</td></tr><tr><td>해운대 권역</td><td>타로, 심리 상담, 궁합</td><td>★★★★☆</td></tr>",
        "subtitle2": "2. 예약 없이 가도 되나요?",
        "content2": "<p>대부분의 용한 곳은 최소 3일 전 예약이 필수입니다. 하지만 최근에는 AI를 통한 비대면 상담도 인기를 끌고 있습니다.</p>",
        "faqs": "<div class='faq-item'><p><strong>Q. 부산에서 작명 잘하는 곳은?</strong></p><p>A. 서면 일대의 경력 30년 이상 노포 철학관들이 한자 획수와 소리 오행을 가장 잘 맞춥니다.</p></div>"
    }

    final_html = HTML_TEMPLATE.format(**sample_data)
    save_post("busan-saju-guide.html", final_html)
