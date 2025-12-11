# ACCESSFLOW

AccessFlow is a DBMS-based web application that allows students to submit outpass/homepass requests and enables teachers to approve or reject them. The system was built using **Node.js, Express, MySQL**, and integrates **Snowflake** and **Tableau** for analytics and reporting.

---

## Features

### Student Module
- Submit outpass/homepass requests
- Check request history and approval status

### Teacher Module
- View and approve/reject pending requests
- Real-time notification updates for new requests

### Analytics Module (Snowflake + Tableau)
- Request volume insights
- Peak request hour detection
- Teacher workload monitoring
- Approval time KPIs and trends

---

## Tech Stack

### **Backend**
- Node.js / Express.js
- MySQL (Transactional OLTP database)

### **Data Warehouse**
- **Snowflake**
  - Internal Stage + `PUT`
  - Batch data loading using `COPY INTO`
  - Star Schema (Fact + Dimension)
  - Query optimization using clustering & pruning
  - Reporting Views

### **Business Intelligence**
- **Tableau**
  - Live connection to Snowflake
  - KPIs, trends, teacher performance dashboards
  - Heatmaps for identifying peak request hours (e.g., 5–7 PM)

---

## Architecture Overview

MySQL (Transactional DB)
↓
Node.js (Exports CSV)
↓
Snowflake Internal Stage
↓ COPY INTO
Staging Tables
↓ MERGE
Analytics Tables (fact_requests, dims)
↓
Snowflake Views (vw_request_reporting)
↓
Tableau Dashboards

---

## YAML — Data Pipeline Definition  
*(Added as requested to describe the pipeline in a structured, DevOps-style format)*

```yaml
pipeline:
  name: accessflow_mysql_to_snowflake
  description: >
    Data ingestion and analytics workflow for AccessFlow.
    Moves data from MySQL -> Node.js export -> Snowflake internal stage -> Analytics tables -> Tableau.

  extraction:
    source: MySQL
    method: NodeJS script
    query: "SELECT * FROM outpass_requests WHERE updated_at >= NOW() - INTERVAL 1 DAY;"
    output_format: CSV

  loading:
    stage_type: snowflake_internal_stage
    commands:
      - "PUT file://outpass_requests.csv @accessflow_internal_stage auto_compress=true;"
      - >
        COPY INTO staging_requests
        FROM @accessflow_internal_stage
        FILE_FORMAT = (FORMAT_NAME='accessflow_csv_format');

  transformation:
    type: ELT
    operations:
      - merge:
          target: fact_requests
          source: staging_requests
          key: request_id
          type: upsert
          sql: >
            MERGE INTO fact_requests t
            USING staging_requests s
            ON t.request_id = s.request_id
            WHEN MATCHED THEN UPDATE SET ...
            WHEN NOT MATCHED THEN INSERT (...);

  analytics:
    schema: star_schema
    fact_table: fact_requests
    dimension_tables:
      - dim_student
      - dim_teacher
      - dim_date
    views:
      - vw_request_reporting

  visualization:
    tool: Tableau
    connection: Snowflake
    dashboards:
      - kpi_summary
      - request_trend_daily
      - approval_time_trend
      - teacher_workload
      - peak_hour_heatmap
      - student_activity_summary
