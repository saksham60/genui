<mxfile host="app.diagrams.net" modified="2025-08-22T09:35:00Z" agent="python" version="24.7.7" type="device">
  <diagram id="7c8f76da" name="Final – Webex Collaboration (Single View)">
    <mxGraphModel dx="1434" dy="721" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1920" pageHeight="1080" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- Title Banner -->
        <mxCell id="title" value="Final Architecture – React → Backend Snapshot → Webex (No Public URLs)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontStyle=1;fontSize=16;align=center;" vertex="1" parent="1">
          <mxGeometry x="40" y="20" width="1840" height="40" as="geometry"/>
        </mxCell>
        
        <!-- Frontend (React) -->
        <mxCell id="frontend" value="Frontend (React SPA)&#10;- Q&amp;A renders Solution&#10;- People picker (emails or search)&#10;- Click: &quot;Create Space&quot;&#10;- Sends one payload" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="60" y="90" width="290" height="140" as="geometry"/>
        </mxCell>
        
        <!-- Backend API / Orchestrator -->
        <mxCell id="api" value="Backend API / Orchestrator&#10;POST /collab/create&#10;- Validate &amp; auth (user/bot)&#10;- Idempotency check&#10;- Orchestrate render &amp; Webex" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;" vertex="1" parent="1">
          <mxGeometry x="380" y="80" width="310" height="160" as="geometry"/>
        </mxCell>
        
        <!-- Token Manager -->
        <mxCell id="auth" value="Token Manager&#10;- Webex OAuth Integration (user)&#10;or Bot Token (invite by email)&#10;- Scope: rooms/memberships/messages (+people if searching)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="720" y="80" width="280" height="160" as="geometry"/>
        </mxCell>
        
        <!-- Idempotency/State -->
        <mxCell id="state" value="Idempotency + State&#10;key = sha256(solutionPayload)+profile+peopleHash&#10;States: RENDERING → READY → POSTING → DONE/FAILED" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="380" y="260" width="620" height="90" as="geometry"/>
        </mxCell>
        
        <!-- Snapshot Renderer -->
        <mxCell id="renderer" value="Snapshot Renderer (Playwright)&#10;- Loads SolutionPrintView&#10;- Print CSS &amp; bundled fonts&#10;- Output Buffer: PNG/JPEG or PDF&#10;- No disk writes" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="60" y="260" width="290" height="140" as="geometry"/>
        </mxCell>
        
        <!-- Pluggable Store -->
        <mxCell id="store" value="Snapshot Store (pluggable, private)&#10;- Phase 0: MemoryStore (RAM)&#10;- Phase 1: Redis TTL (retries/idempotency)&#10;- Phase 2: Object Store (S3/GCS) – encrypted, lifecycle" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="60" y="430" width="290" height="170" as="geometry"/>
        </mxCell>
        
        <!-- Optional Queue/Worker (in same view, dashed border) -->
        <mxCell id="queue" value="Async Job Queue (optional)&#10;- Enqueue render/post job&#10;- Worker executes with same Token Manager&#10;- Use for heavy loads or rate limits" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#d6b656;dashed=1;" vertex="1" parent="1">
          <mxGeometry x="380" y="370" width="310" height="140" as="geometry"/>
        </mxCell>
        
        <!-- Observability -->
        <mxCell id="obs" value="Observability&#10;- Metrics: render_ms, bytes, 429s&#10;- Logs &amp; Traces&#10;- Audit: roomId, messageId, sha256" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;" vertex="1" parent="1">
          <mxGeometry x="720" y="370" width="280" height="140" as="geometry"/>
        </mxCell>
        
        <!-- Webex Cloud -->
        <mxCell id="webex" value="Webex Cloud (REST APIs)" style="swimlane;childLayout=stackLayout;rounded=1;horizontal=0;startSize=30;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="1040" y="80" width="380" height="300" as="geometry"/>
        </mxCell>
        <mxCell id="rooms" value="Rooms: POST /v1/rooms" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9673a6;" vertex="1" parent="webex">
          <mxGeometry x="10" y="40" width="360" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="memberships" value="Memberships: POST /v1/memberships (per user)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9673a6;" vertex="1" parent="webex">
          <mxGeometry x="10" y="110" width="360" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="messages" value="Messages: POST /v1/messages (multipart, attach Buffer)&#10;Max 100 MB; previews for PNG/JPEG/PDF" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#9673a6;" vertex="1" parent="webex">
          <mxGeometry x="10" y="180" width="360" height="80" as="geometry"/>
        </mxCell>
        
        <!-- Output / Return -->
        <mxCell id="result" value="Response to Client&#10;- roomId, messageId, spaceTitle&#10;- (Optional) Deep link or embed widget" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e6f7ff;strokeColor=#1a73e8;" vertex="1" parent="1">
          <mxGeometry x="1450" y="90" width="360" height="120" as="geometry"/>
        </mxCell>
        
        <!-- Notes -->
        <mxCell id="notes" value="Notes:&#10;• No public URLs. File stays server-side.&#10;• Choose PNG/JPEG/PDF dynamically (size/length).&#10;• Retry/backoff for Webex 429/423/5xx.&#10;• Security: private buckets, KMS, PII masking pre-render." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#999999;" vertex="1" parent="1">
          <mxGeometry x="1450" y="230" width="360" height="150" as="geometry"/>
        </mxCell>
        
        <!-- Edges / Numbered flow -->
        <mxCell id="e1" value="1) Collaborate payload" style="endArrow=block;html=1;strokeColor=#6c8ebf;" edge="1" parent="1" source="frontend" target="api">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e2" value="2) Idempotency check" style="endArrow=block;html=1;strokeColor=#666666;" edge="1" parent="1" source="api" target="state">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e3" value="3) Render request" style="endArrow=block;html=1;strokeColor=#82b366;" edge="1" parent="1" source="api" target="renderer">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e4" value="4) Put buffer" style="endArrow=block;html=1;strokeColor=#b85450;" edge="1" parent="1" source="renderer" target="store">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e5" value="5) Get buffer/stream" style="endArrow=block;html=1;strokeColor=#b85450;" edge="1" parent="1" source="store" target="api">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e6" value="6) Create room" style="endArrow=block;html=1;strokeColor=#9673a6;" edge="1" parent="1" source="api" target="rooms">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e7" value="7) Add members (loop)" style="endArrow=block;html=1;strokeColor=#9673a6;" edge="1" parent="1" source="api" target="memberships">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e8" value="8) Post file (multipart)" style="endArrow=block;html=1;strokeColor=#9673a6;" edge="1" parent="1" source="api" target="messages">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e9" value="9) Result" style="endArrow=block;html=1;strokeColor=#1a73e8;" edge="1" parent="1" source="api" target="result">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
        <!-- Connect API to Token Manager and Queue/Obs -->
        <mxCell id="e10" value="tokens" style="endArrow=block;html=1;strokeColor=#d6b656;" edge="1" parent="1" source="api" target="auth">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e11" value="(optional) enqueue" style="endArrow=block;html=1;strokeColor=#d6b656;dashed=1;" edge="1" parent="1" source="api" target="queue">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e12" value="metrics/logs" style="endArrow=block;html=1;strokeColor=#666666;dashed=1;" edge="1" parent="1" source="api" target="obs">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e13" value="metrics/logs" style="endArrow=block;html=1;strokeColor=#666666;dashed=1;" edge="1" parent="1" source="renderer" target="obs">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
