--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: ActiveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ActiveStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING'
);


ALTER TYPE public."ActiveStatus" OWNER TO postgres;

--
-- Name: CompanyRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CompanyRole" AS ENUM (
    'Admin',
    'Employee',
    'Manager'
);


ALTER TYPE public."CompanyRole" OWNER TO postgres;

--
-- Name: DefinitionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DefinitionStatus" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public."DefinitionStatus" OWNER TO postgres;

--
-- Name: Document; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Document" AS ENUM (
    'ID',
    'Passport',
    'Visa',
    'Insurance',
    'Health',
    'Contract',
    'Certificate',
    'Other'
);


ALTER TYPE public."Document" OWNER TO postgres;

--
-- Name: DocumentSystemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentSystemType" AS ENUM (
    'INVOICE',
    'RECEIPT',
    'CONTRACT',
    'OFFER',
    'ID',
    'PASSPORT',
    'VISA',
    'INSURANCE',
    'HEALTH',
    'CERTIFICATE',
    'OTHER'
);


ALTER TYPE public."DocumentSystemType" OWNER TO postgres;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Language" AS ENUM (
    'cz',
    'de',
    'en'
);


ALTER TYPE public."Language" OWNER TO postgres;

--
-- Name: RequestType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestType" AS ENUM (
    'Documents',
    'Vacation',
    'Leave',
    'Training',
    'Raise',
    'Department',
    'Other',
    'Sick'
);


ALTER TYPE public."RequestType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'admin',
    'user',
    'guest'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: RuntimeStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RuntimeStatus" AS ENUM (
    'pending',
    'completed',
    'failed'
);


ALTER TYPE public."RuntimeStatus" OWNER TO postgres;

--
-- Name: crm_Contact_Type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Contact_Type" AS ENUM (
    'Customer',
    'Partner',
    'Vendor'
);


ALTER TYPE public."crm_Contact_Type" OWNER TO postgres;

--
-- Name: crm_Lead_Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Lead_Status" AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'LOST'
);


ALTER TYPE public."crm_Lead_Status" OWNER TO postgres;

--
-- Name: crm_Lead_Type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Lead_Type" AS ENUM (
    'DEMO'
);


ALTER TYPE public."crm_Lead_Type" OWNER TO postgres;

--
-- Name: crm_Opportunity_Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Opportunity_Status" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'CLOSED'
);


ALTER TYPE public."crm_Opportunity_Status" OWNER TO postgres;

--
-- Name: gptStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."gptStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."gptStatus" OWNER TO postgres;

--
-- Name: taskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."taskStatus" AS ENUM (
    'ACTIVE',
    'PENDING',
    'COMPLETE'
);


ALTER TYPE public."taskStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Boards" (
    id text NOT NULL,
    description text NOT NULL,
    favourite boolean,
    "favouritePosition" integer,
    icon text,
    "position" integer,
    title text NOT NULL,
    "user" text NOT NULL,
    visibility text,
    date_created date DEFAULT CURRENT_TIMESTAMP,
    last_edited date,
    watchers text[]
);


ALTER TABLE public."Boards" OWNER TO postgres;

--
-- Name: Definitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Definitions" (
    id text NOT NULL,
    name text NOT NULL,
    tasks jsonb[],
    global jsonb,
    "uiObject" jsonb,
    "userWfDefinitionId" text NOT NULL,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    description text NOT NULL,
    "updatedAt" date,
    "definitionStatus" public."DefinitionStatus" DEFAULT 'active'::public."DefinitionStatus" NOT NULL
);


ALTER TABLE public."Definitions" OWNER TO postgres;

--
-- Name: Documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documents" (
    id text NOT NULL,
    date_created date DEFAULT CURRENT_TIMESTAMP,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp(3) without time zone,
    "updatedAt" date,
    document_name text NOT NULL,
    created_by_user text,
    "createdBy" text,
    description text,
    document_type text,
    favourite boolean,
    "document_file_mimeType" text NOT NULL,
    document_file_url text NOT NULL,
    status text,
    visibility text,
    tags jsonb,
    key text,
    size integer,
    assigned_user text,
    connected_documents text[],
    "invoiceIDs" text[],
    "opportunityIDs" text[],
    "contactsIDs" text[],
    "tasksIDs" text[],
    "crm_accounts_tasksIDs" text,
    "leadsIDs" text[],
    "accountsIDs" text[],
    "localFile" text NOT NULL,
    "employeeID" text NOT NULL,
    document_system_type public."DocumentSystemType" DEFAULT 'OTHER'::public."DocumentSystemType"
);


ALTER TABLE public."Documents" OWNER TO postgres;

--
-- Name: Documents_Types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documents_Types" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Documents_Types" OWNER TO postgres;

--
-- Name: Employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employee" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    role public."CompanyRole" DEFAULT 'Employee'::public."CompanyRole" NOT NULL,
    "position" text,
    salary double precision DEFAULT 0.00 NOT NULL,
    "onBoarding" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "IBAN" text NOT NULL,
    photo text,
    taxid text,
    address text,
    insurance text,
    "teamsId" text,
    assigned_to text,
    "createdBy" text,
    "updatedBy" text
);


ALTER TABLE public."Employee" OWNER TO postgres;

--
-- Name: ImageUpload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImageUpload" (
    id text NOT NULL
);


ALTER TABLE public."ImageUpload" OWNER TO postgres;

--
-- Name: Invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoices" (
    id text NOT NULL,
    date_created date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_updated timestamp(3) without time zone NOT NULL,
    last_updated_by text,
    date_received date DEFAULT CURRENT_TIMESTAMP,
    date_of_case date,
    date_tax date,
    date_due date,
    description text,
    document_type text,
    favorite boolean DEFAULT false,
    variable_symbol text,
    constant_symbol text,
    specific_symbol text,
    order_number text,
    internal_number text,
    invoice_number text,
    invoice_amount text,
    "invoice_file_mimeType" text NOT NULL,
    invoice_file_url text NOT NULL,
    invoice_items jsonb,
    invoice_type text,
    invoice_currency text,
    invoice_language text,
    partner text,
    partner_street text,
    partner_city text,
    partner_zip text,
    partner_country text,
    partner_country_code text,
    partner_business_street text,
    partner_business_city text,
    partner_business_zip text,
    partner_business_country text,
    partner_business_country_code text,
    "partner_VAT_number" text,
    "partner_TAX_number" text,
    "partner_TAX_local_number" text,
    partner_phone_prefix text,
    partner_phone_number text,
    partner_fax_prefix text,
    partner_fax_number text,
    partner_email text,
    partner_website text,
    partner_is_person boolean,
    partner_bank text,
    partner_account_number text,
    partner_account_bank_number text,
    "partner_IBAN" text,
    "partner_SWIFT" text,
    "partner_BIC" text,
    rossum_status text,
    rossum_annotation_id text,
    rossum_annotation_url text,
    rossum_document_id text,
    rossum_document_url text,
    rossum_annotation_json_url text,
    rossum_annotation_xml_url text,
    money_s3_url text,
    status text,
    invoice_state_id text,
    assigned_user_id text,
    assigned_account_id text,
    visibility boolean DEFAULT true NOT NULL,
    connected_documents text[]
);


ALTER TABLE public."Invoices" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "fromID" text NOT NULL,
    "toID" text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: MyAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MyAccount" (
    id text NOT NULL,
    company_name text NOT NULL,
    is_person boolean DEFAULT false NOT NULL,
    email text,
    email_accountant text,
    phone_prefix text,
    phone text,
    mobile_prefix text,
    mobile text,
    fax_prefix text,
    fax text,
    website text,
    street text,
    city text,
    state text,
    zip text,
    country text,
    country_code text,
    billing_street text,
    billing_city text,
    billing_state text,
    billing_zip text,
    billing_country text,
    billing_country_code text,
    currency text,
    currency_symbol text,
    "VAT_number" text NOT NULL,
    "TAX_number" text,
    bank_name text,
    bank_account text,
    bank_code text,
    "bank_IBAN" text,
    "bank_SWIFT" text
);


ALTER TABLE public."MyAccount" OWNER TO postgres;

--
-- Name: PaySlip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaySlip" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    month timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "localFile" text NOT NULL
);


ALTER TABLE public."PaySlip" OWNER TO postgres;

--
-- Name: PaySlipData; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaySlipData" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    hours double precision NOT NULL,
    rate double precision NOT NULL,
    deduction double precision NOT NULL,
    "IBAN" text NOT NULL,
    month timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaySlipData" OWNER TO postgres;

--
-- Name: Request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Request" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    type public."RequestType" NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    message text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Request" OWNER TO postgres;

--
-- Name: Runtimes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Runtimes" (
    id text NOT NULL,
    "workflowResults" jsonb,
    global jsonb,
    "workflowStatus" public."RuntimeStatus" DEFAULT 'pending'::public."RuntimeStatus" NOT NULL,
    "workflowDefinitionId" text NOT NULL,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" date,
    tasks jsonb[],
    logs jsonb[]
);


ALTER TABLE public."Runtimes" OWNER TO postgres;

--
-- Name: Schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Schedule" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "timeIn" timestamp(3) without time zone NOT NULL,
    "timeOut" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Schedule" OWNER TO postgres;

--
-- Name: Sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sections" (
    id text NOT NULL,
    board text NOT NULL,
    title text NOT NULL,
    "position" integer
);


ALTER TABLE public."Sections" OWNER TO postgres;

--
-- Name: Tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tasks" (
    id text NOT NULL,
    content text,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text,
    "dueDateAt" date DEFAULT CURRENT_TIMESTAMP,
    "lastEditedAt" date DEFAULT CURRENT_TIMESTAMP,
    "position" integer NOT NULL,
    priority text NOT NULL,
    section text,
    tags jsonb,
    title text NOT NULL,
    likes integer DEFAULT 0,
    "user" text,
    "documentIDs" text[],
    "taskStatus" public."taskStatus" DEFAULT 'ACTIVE'::public."taskStatus"
);


ALTER TABLE public."Tasks" OWNER TO postgres;

--
-- Name: TeamMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMessage" (
    id text NOT NULL,
    "fromID" text NOT NULL,
    "toID" text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeamMessage" OWNER TO postgres;

--
-- Name: TeamTask; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamTask" (
    id text NOT NULL,
    "teamID" text NOT NULL,
    task text NOT NULL,
    description text,
    done boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deadline timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeamTask" OWNER TO postgres;

--
-- Name: Teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Teams" (
    id text NOT NULL,
    name text NOT NULL,
    tasks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Teams" OWNER TO postgres;

--
-- Name: Timekeeping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Timekeeping" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    "timeIn" timestamp(3) without time zone NOT NULL,
    "timeOut" timestamp(3) without time zone,
    verified boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Timekeeping" OWNER TO postgres;

--
-- Name: TodoList; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TodoList" (
    id text NOT NULL,
    "createdAt" text NOT NULL,
    description text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    "user" text NOT NULL
);


ALTER TABLE public."TodoList" OWNER TO postgres;

--
-- Name: Training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Training" (
    id text NOT NULL,
    "employeeID" text NOT NULL,
    type text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "time" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "localFile" text NOT NULL
);


ALTER TABLE public."Training" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id text NOT NULL,
    account_name text,
    avatar text,
    email text NOT NULL,
    is_account_admin boolean DEFAULT false NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_on date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastLoginAt" date,
    name text,
    password text,
    username text,
    "userStatus" public."ActiveStatus" DEFAULT 'PENDING'::public."ActiveStatus" NOT NULL,
    "userLanguage" public."Language" DEFAULT 'en'::public."Language" NOT NULL,
    "watching_boardsIDs" text[],
    "watching_accountsIDs" text[],
    role public."Role" DEFAULT 'guest'::public."Role" NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: _BoardsToUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BoardsToUsers" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BoardsToUsers" OWNER TO postgres;

--
-- Name: _DocumentsToInvoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsToInvoices" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsToInvoices" OWNER TO postgres;

--
-- Name: _DocumentsToTasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsToTasks" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsToTasks" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Accounts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Accounts" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Contacts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Contacts" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Leads" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Leads" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Opportunities" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Opportunities" OWNER TO postgres;

--
-- Name: _TeamTaskTotasksComments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_TeamTaskTotasksComments" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_TeamTaskTotasksComments" OWNER TO postgres;

--
-- Name: _crm_ContactsTocrm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_crm_ContactsTocrm_Opportunities" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_crm_ContactsTocrm_Opportunities" OWNER TO postgres;

--
-- Name: _watching_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._watching_accounts (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public._watching_accounts OWNER TO postgres;

--
-- Name: crm_Accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Accounts" (
    id text NOT NULL,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text,
    annual_revenue text,
    assigned_to text,
    billing_city text,
    billing_country text,
    billing_postal_code text,
    billing_state text,
    billing_street text,
    company_id text,
    description text,
    email text,
    employees text,
    fax text,
    industry text,
    member_of text,
    name text NOT NULL,
    office_phone text,
    shipping_city text,
    shipping_country text,
    shipping_postal_code text,
    shipping_state text,
    shipping_street text,
    status text DEFAULT 'Inactive'::text,
    type text DEFAULT 'Customer'::text,
    vat text,
    website text,
    "documentsIDs" text[],
    watchers text[]
);


ALTER TABLE public."crm_Accounts" OWNER TO postgres;

--
-- Name: crm_Accounts_Tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Accounts_Tasks" (
    id text NOT NULL,
    content text,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text,
    "dueDateAt" date DEFAULT CURRENT_TIMESTAMP,
    priority text NOT NULL,
    tags jsonb,
    title text NOT NULL,
    likes integer DEFAULT 0,
    "user" text,
    account text,
    "taskStatus" public."taskStatus" DEFAULT 'ACTIVE'::public."taskStatus"
);


ALTER TABLE public."crm_Accounts_Tasks" OWNER TO postgres;

--
-- Name: crm_Contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Contacts" (
    id text NOT NULL,
    account text,
    assigned_to text,
    birthday text,
    created_by text,
    "createdBy" text,
    created_on timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    last_activity date DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" date,
    "updatedBy" text,
    last_activity_by text,
    description text,
    email text,
    personal_email text,
    first_name text,
    last_name text NOT NULL,
    office_phone text,
    mobile_phone text,
    website text,
    "position" text,
    status boolean DEFAULT true NOT NULL,
    social_twitter text,
    social_facebook text,
    social_linkedin text,
    social_skype text,
    social_instagram text,
    social_youtube text,
    social_tiktok text,
    type text DEFAULT 'Customer'::text,
    "opportunitiesIDs" text[],
    "accountsIDs" text,
    "documentsIDs" text[]
);


ALTER TABLE public."crm_Contacts" OWNER TO postgres;

--
-- Name: crm_Industry_Type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Industry_Type" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."crm_Industry_Type" OWNER TO postgres;

--
-- Name: crm_Leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Leads" (
    id text NOT NULL,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text,
    "firstName" text,
    "lastName" text NOT NULL,
    company text,
    "jobTitle" text,
    email text,
    phone text,
    description text,
    lead_source text,
    refered_by text,
    campaign text,
    status text DEFAULT 'NEW'::text,
    type text DEFAULT 'DEMO'::text,
    assigned_to text,
    "accountsIDs" text,
    "documentsIDs" text[]
);


ALTER TABLE public."crm_Leads" OWNER TO postgres;

--
-- Name: crm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities" (
    id text NOT NULL,
    account text,
    assigned_to text,
    budget integer DEFAULT 0 NOT NULL,
    campaign text,
    close_date date,
    contact text,
    created_by text,
    "createdBy" text,
    created_on date DEFAULT CURRENT_TIMESTAMP,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    last_activity date,
    "updatedAt" date,
    "updatedBy" text,
    last_activity_by text,
    currency text,
    description text,
    expected_revenue integer DEFAULT 0 NOT NULL,
    name text,
    next_step text,
    sales_stage text,
    type text,
    status public."crm_Opportunity_Status" DEFAULT 'ACTIVE'::public."crm_Opportunity_Status",
    connected_documents text[],
    connected_contacts text[]
);


ALTER TABLE public."crm_Opportunities" OWNER TO postgres;

--
-- Name: crm_Opportunities_Sales_Stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities_Sales_Stages" (
    id text NOT NULL,
    name text NOT NULL,
    probability integer,
    "order" integer
);


ALTER TABLE public."crm_Opportunities_Sales_Stages" OWNER TO postgres;

--
-- Name: crm_Opportunities_Type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities_Type" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer
);


ALTER TABLE public."crm_Opportunities_Type" OWNER TO postgres;

--
-- Name: crm_campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_campaigns (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    status text
);


ALTER TABLE public.crm_campaigns OWNER TO postgres;

--
-- Name: gpt_models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gpt_models (
    id text NOT NULL,
    model text NOT NULL,
    description text,
    status public."gptStatus",
    created_on date DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gpt_models OWNER TO postgres;

--
-- Name: invoice_States; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."invoice_States" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."invoice_States" OWNER TO postgres;

--
-- Name: modulStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."modulStatus" (
    id text NOT NULL,
    name text NOT NULL,
    "isVisible" boolean NOT NULL
);


ALTER TABLE public."modulStatus" OWNER TO postgres;

--
-- Name: openAi_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."openAi_keys" (
    id text NOT NULL,
    "user" text NOT NULL,
    organization_id text NOT NULL,
    api_key text NOT NULL
);


ALTER TABLE public."openAi_keys" OWNER TO postgres;

--
-- Name: secondBrain_notions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."secondBrain_notions" (
    id text NOT NULL,
    "user" text NOT NULL,
    notion_api_key text NOT NULL,
    notion_db_id text NOT NULL
);


ALTER TABLE public."secondBrain_notions" OWNER TO postgres;

--
-- Name: systemServices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."systemServices" (
    id text NOT NULL,
    name text NOT NULL,
    "serviceUrl" text,
    "serviceId" text,
    "serviceKey" text,
    "servicePassword" text,
    "servicePort" text,
    description text
);


ALTER TABLE public."systemServices" OWNER TO postgres;

--
-- Name: system_Modules_Enabled; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."system_Modules_Enabled" (
    id text NOT NULL,
    name text NOT NULL,
    enabled boolean NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE public."system_Modules_Enabled" OWNER TO postgres;

--
-- Name: tasksComments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."tasksComments" (
    id text NOT NULL,
    comment text NOT NULL,
    "createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    task text NOT NULL,
    "user" text NOT NULL,
    "employeeID" text NOT NULL,
    assigned_crm_account_task text
);


ALTER TABLE public."tasksComments" OWNER TO postgres;

--
-- Data for Name: Boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Boards" (id, description, favourite, "favouritePosition", icon, "position", title, "user", visibility, date_created, last_edited, watchers) FROM stdin;
\.


--
-- Data for Name: Definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Definitions" (id, name, tasks, global, "uiObject", "userWfDefinitionId", "createdAt", description, "updatedAt", "definitionStatus") FROM stdin;
\.


--
-- Data for Name: Documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documents" (id, date_created, "createdAt", last_updated, "updatedAt", document_name, created_by_user, "createdBy", description, document_type, favourite, "document_file_mimeType", document_file_url, status, visibility, tags, key, size, assigned_user, connected_documents, "invoiceIDs", "opportunityIDs", "contactsIDs", "tasksIDs", "crm_accounts_tasksIDs", "leadsIDs", "accountsIDs", "localFile", "employeeID", document_system_type) FROM stdin;
\.


--
-- Data for Name: Documents_Types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documents_Types" (id, name) FROM stdin;
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employee" (id, "firstName", "lastName", email, phone, role, "position", salary, "onBoarding", "createdAt", "updatedAt", "IBAN", photo, taxid, address, insurance, "teamsId", assigned_to, "createdBy", "updatedBy") FROM stdin;
\.


--
-- Data for Name: ImageUpload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImageUpload" (id) FROM stdin;
\.


--
-- Data for Name: Invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoices" (id, date_created, last_updated, last_updated_by, date_received, date_of_case, date_tax, date_due, description, document_type, favorite, variable_symbol, constant_symbol, specific_symbol, order_number, internal_number, invoice_number, invoice_amount, "invoice_file_mimeType", invoice_file_url, invoice_items, invoice_type, invoice_currency, invoice_language, partner, partner_street, partner_city, partner_zip, partner_country, partner_country_code, partner_business_street, partner_business_city, partner_business_zip, partner_business_country, partner_business_country_code, "partner_VAT_number", "partner_TAX_number", "partner_TAX_local_number", partner_phone_prefix, partner_phone_number, partner_fax_prefix, partner_fax_number, partner_email, partner_website, partner_is_person, partner_bank, partner_account_number, partner_account_bank_number, "partner_IBAN", "partner_SWIFT", "partner_BIC", rossum_status, rossum_annotation_id, rossum_annotation_url, rossum_document_id, rossum_document_url, rossum_annotation_json_url, rossum_annotation_xml_url, money_s3_url, status, invoice_state_id, assigned_user_id, assigned_account_id, visibility, connected_documents) FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "fromID", "toID", message, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MyAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MyAccount" (id, company_name, is_person, email, email_accountant, phone_prefix, phone, mobile_prefix, mobile, fax_prefix, fax, website, street, city, state, zip, country, country_code, billing_street, billing_city, billing_state, billing_zip, billing_country, billing_country_code, currency, currency_symbol, "VAT_number", "TAX_number", bank_name, bank_account, bank_code, "bank_IBAN", "bank_SWIFT") FROM stdin;
\.


--
-- Data for Name: PaySlip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaySlip" (id, "employeeID", month, "createdAt", "updatedAt", "localFile") FROM stdin;
\.


--
-- Data for Name: PaySlipData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaySlipData" (id, "employeeID", hours, rate, deduction, "IBAN", month, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Request; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Request" (id, "employeeID", type, approved, message, date, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Runtimes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Runtimes" (id, "workflowResults", global, "workflowStatus", "workflowDefinitionId", "createdAt", "updatedAt", tasks, logs) FROM stdin;
\.


--
-- Data for Name: Schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Schedule" (id, "employeeID", date, "timeIn", "timeOut", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sections" (id, board, title, "position") FROM stdin;
\.


--
-- Data for Name: Tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tasks" (id, content, "createdAt", "createdBy", "updatedAt", "updatedBy", "dueDateAt", "lastEditedAt", "position", priority, section, tags, title, likes, "user", "documentIDs", "taskStatus") FROM stdin;
\.


--
-- Data for Name: TeamMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMessage" (id, "fromID", "toID", message, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamTask; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamTask" (id, "teamID", task, description, done, "createdAt", "updatedAt", deadline) FROM stdin;
\.


--
-- Data for Name: Teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Teams" (id, name, tasks, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Timekeeping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Timekeeping" (id, "employeeID", "timeIn", "timeOut", verified, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TodoList; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TodoList" (id, "createdAt", description, title, url, "user") FROM stdin;
\.


--
-- Data for Name: Training; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Training" (id, "employeeID", type, date, "time", "createdAt", "updatedAt", "localFile") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, account_name, avatar, email, is_account_admin, is_admin, created_on, "lastLoginAt", name, password, username, "userStatus", "userLanguage", "watching_boardsIDs", "watching_accountsIDs", role) FROM stdin;
clr6yh2cz0000lzn8sj0qw4fu			saashqdev@gmail.com	f	t	2024-01-09	2024-01-30	SaasHQ	$2a$12$gfJmtKXHv4.XVYad8X67.ur2wonnaqJawI5lkARIQJu.Sj8Y4SeWy	saashq	ACTIVE	en	\N	\N	guest
\.


--
-- Data for Name: _BoardsToUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BoardsToUsers" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsToInvoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsToInvoices" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsToTasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsToTasks" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Accounts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Contacts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Leads" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Opportunities" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _TeamTaskTotasksComments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_TeamTaskTotasksComments" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _crm_ContactsTocrm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_crm_ContactsTocrm_Opportunities" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _watching_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._watching_accounts ("A", "B") FROM stdin;
\.


--
-- Data for Name: crm_Accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Accounts" (id, "createdAt", "createdBy", "updatedAt", "updatedBy", annual_revenue, assigned_to, billing_city, billing_country, billing_postal_code, billing_state, billing_street, company_id, description, email, employees, fax, industry, member_of, name, office_phone, shipping_city, shipping_country, shipping_postal_code, shipping_state, shipping_street, status, type, vat, website, "documentsIDs", watchers) FROM stdin;
\.


--
-- Data for Name: crm_Accounts_Tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Accounts_Tasks" (id, content, "createdAt", "createdBy", "updatedAt", "updatedBy", "dueDateAt", priority, tags, title, likes, "user", account, "taskStatus") FROM stdin;
\.


--
-- Data for Name: crm_Contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Contacts" (id, account, assigned_to, birthday, created_by, "createdBy", created_on, "createdAt", last_activity, "updatedAt", "updatedBy", last_activity_by, description, email, personal_email, first_name, last_name, office_phone, mobile_phone, website, "position", status, social_twitter, social_facebook, social_linkedin, social_skype, social_instagram, social_youtube, social_tiktok, type, "opportunitiesIDs", "accountsIDs", "documentsIDs") FROM stdin;
clr89ejrq0000cjcbqkm5alje	\N	clr6yh2cz0000lzn8sj0qw4fu	undefined/undefined/undefined	\N	clr6yh2cz0000lzn8sj0qw4fu	2024-01-10 20:54:53.847	2024-01-10	2024-01-10	2024-01-10	clr6yh2cz0000lzn8sj0qw4fu	\N	IT Guy	dave@gridworkz.com	dave@gridworkz.com	Dave	Cook	2893037651	2893037651	demo.saashq.org	\N	t	\N	\N	\N	\N	\N	\N	\N	Partner	\N	\N	\N
\.


--
-- Data for Name: crm_Industry_Type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Industry_Type" (id, name) FROM stdin;
clr6yxdy6000p26agkexejlm3	Public sector
clr6yxdy6000q26agem92o994	Other
clr6yxdy6000r26ag5vxgl9e9	SW Development
\.


--
-- Data for Name: crm_Leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Leads" (id, "createdAt", "createdBy", "updatedAt", "updatedBy", "firstName", "lastName", company, "jobTitle", email, phone, description, lead_source, refered_by, campaign, status, type, assigned_to, "accountsIDs", "documentsIDs") FROM stdin;
\.


--
-- Data for Name: crm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities" (id, account, assigned_to, budget, campaign, close_date, contact, created_by, "createdBy", created_on, "createdAt", last_activity, "updatedAt", "updatedBy", last_activity_by, currency, description, expected_revenue, name, next_step, sales_stage, type, status, connected_documents, connected_contacts) FROM stdin;
\.


--
-- Data for Name: crm_Opportunities_Sales_Stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities_Sales_Stages" (id, name, probability, "order") FROM stdin;
clr6yxdx2000e26agquf2ak4r	New	10	0
clr6yxdx3000f26agauet4idg	Need analysis	25	0
clr6yxdx3000g26agmfmouwk7	Signing	95	\N
clr6yxdx3000h26agj2o9cbrq	Offer sent	30	\N
clr6yxdx3000i26ag8shujzio	Offer accepted	45	\N
clr6yxdx3000j26agea8mzij9	Contract draft	65	\N
clr6yxdx3000k26agiycursl4	Contract negotiation	75	\N
clr6yxdx3000l26agpie56a8j	Send for signing	80	\N
clr6yxdx3000m26agcuz977dc	Realization of the project	100	\N
\.


--
-- Data for Name: crm_Opportunities_Type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities_Type" (id, name, "order") FROM stdin;
clr6yxdwa000a26agt4tx8cdc	Business from partners	2
clr6yxdwa000b26agm4e2v5r4	Upsale	3
clr6yxdwa000c26agfczbmw75	New deal	1
clr6yxdwa000d26agt2475u2k	Cross sale	4
\.


--
-- Data for Name: crm_campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_campaigns (id, name, description, status) FROM stdin;
clr6yxdxn000n26agt5ccrk7t	Social networks	Instagram, Facebook, Twitter	ACTIVE
clr6yxdxn000o26aglvs15fvo	Cold calls	Our call center	\N
\.


--
-- Data for Name: gpt_models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gpt_models (id, model, description, status, created_on) FROM stdin;
clr6yxe00000s26ag9mwv3cpx	gpt-3.5-turbo	GPT 3.5 Turbo	ACTIVE	2024-01-09
clr6yxe00000t26agzcthzj8s	gpt-4	GPT 4	INACTIVE	2024-01-09
\.


--
-- Data for Name: invoice_States; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."invoice_States" (id, name) FROM stdin;
\.


--
-- Data for Name: modulStatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."modulStatus" (id, name, "isVisible") FROM stdin;
\.


--
-- Data for Name: openAi_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."openAi_keys" (id, "user", organization_id, api_key) FROM stdin;
\.


--
-- Data for Name: secondBrain_notions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."secondBrain_notions" (id, "user", notion_api_key, notion_db_id) FROM stdin;
\.


--
-- Data for Name: systemServices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."systemServices" (id, name, "serviceUrl", "serviceId", "serviceKey", "servicePassword", "servicePort", description) FROM stdin;
\.


--
-- Data for Name: system_Modules_Enabled; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."system_Modules_Enabled" (id, name, enabled, "position") FROM stdin;
clr6yxdvr000026aglzz0lz1a	crm	t	1
clr6yxdvs000126agadmbrbty	projects	t	2
clr6yxdvs000326agegtpo2pj	secondBrain	t	4
clr6yxdvs000526agjcx1li5h	invoice	t	6
clr6yxdvs000226agut4m4ut9	emails	t	3
clr6yxdvs000426ag66brka2z	employee	t	5
clr6yxdvs000626agrpe9ndwl	reports	t	8
clr6yxdvs000726agxierp4a3	documents	t	9
clr6yxdvs000826agvrm25fw6	databox	f	10
clr6yxdvs000926ag52vwe149	openai	t	11
6elbe89nn18lw408dt9c1hovo	workflows	t	7
\.


--
-- Data for Name: tasksComments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."tasksComments" (id, comment, "createdAt", task, "user", "employeeID", assigned_crm_account_task) FROM stdin;
\.


--
-- Name: Boards Boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_pkey" PRIMARY KEY (id);


--
-- Name: Definitions Definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Definitions"
    ADD CONSTRAINT "Definitions_pkey" PRIMARY KEY (id);


--
-- Name: Documents_Types Documents_Types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents_Types"
    ADD CONSTRAINT "Documents_Types_pkey" PRIMARY KEY (id);


--
-- Name: Documents Documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_pkey" PRIMARY KEY (id);


--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);


--
-- Name: ImageUpload ImageUpload_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImageUpload"
    ADD CONSTRAINT "ImageUpload_pkey" PRIMARY KEY (id);


--
-- Name: Invoices Invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: MyAccount MyAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MyAccount"
    ADD CONSTRAINT "MyAccount_pkey" PRIMARY KEY (id);


--
-- Name: PaySlipData PaySlipData_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaySlipData"
    ADD CONSTRAINT "PaySlipData_pkey" PRIMARY KEY (id);


--
-- Name: PaySlip PaySlip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaySlip"
    ADD CONSTRAINT "PaySlip_pkey" PRIMARY KEY (id);


--
-- Name: Request Request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY (id);


--
-- Name: Runtimes Runtimes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Runtimes"
    ADD CONSTRAINT "Runtimes_pkey" PRIMARY KEY (id);


--
-- Name: Schedule Schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY (id);


--
-- Name: Sections Sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sections"
    ADD CONSTRAINT "Sections_pkey" PRIMARY KEY (id);


--
-- Name: Tasks Tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY (id);


--
-- Name: TeamMessage TeamMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMessage"
    ADD CONSTRAINT "TeamMessage_pkey" PRIMARY KEY (id);


--
-- Name: TeamTask TeamTask_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamTask"
    ADD CONSTRAINT "TeamTask_pkey" PRIMARY KEY (id);


--
-- Name: Teams Teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Teams"
    ADD CONSTRAINT "Teams_pkey" PRIMARY KEY (id);


--
-- Name: Timekeeping Timekeeping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Timekeeping"
    ADD CONSTRAINT "Timekeeping_pkey" PRIMARY KEY (id);


--
-- Name: TodoList TodoList_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TodoList"
    ADD CONSTRAINT "TodoList_pkey" PRIMARY KEY (id);


--
-- Name: Training Training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: crm_Accounts_Tasks crm_Accounts_Tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts_Tasks"
    ADD CONSTRAINT "crm_Accounts_Tasks_pkey" PRIMARY KEY (id);


--
-- Name: crm_Accounts crm_Accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_pkey" PRIMARY KEY (id);


--
-- Name: crm_Contacts crm_Contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_pkey" PRIMARY KEY (id);


--
-- Name: crm_Industry_Type crm_Industry_Type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Industry_Type"
    ADD CONSTRAINT "crm_Industry_Type_pkey" PRIMARY KEY (id);


--
-- Name: crm_Leads crm_Leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Leads"
    ADD CONSTRAINT "crm_Leads_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities_Sales_Stages crm_Opportunities_Sales_Stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities_Sales_Stages"
    ADD CONSTRAINT "crm_Opportunities_Sales_Stages_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities_Type crm_Opportunities_Type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities_Type"
    ADD CONSTRAINT "crm_Opportunities_Type_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities crm_Opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_pkey" PRIMARY KEY (id);


--
-- Name: crm_campaigns crm_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_campaigns
    ADD CONSTRAINT crm_campaigns_pkey PRIMARY KEY (id);


--
-- Name: gpt_models gpt_models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gpt_models
    ADD CONSTRAINT gpt_models_pkey PRIMARY KEY (id);


--
-- Name: invoice_States invoice_States_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."invoice_States"
    ADD CONSTRAINT "invoice_States_pkey" PRIMARY KEY (id);


--
-- Name: modulStatus modulStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."modulStatus"
    ADD CONSTRAINT "modulStatus_pkey" PRIMARY KEY (id);


--
-- Name: openAi_keys openAi_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."openAi_keys"
    ADD CONSTRAINT "openAi_keys_pkey" PRIMARY KEY (id);


--
-- Name: secondBrain_notions secondBrain_notions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."secondBrain_notions"
    ADD CONSTRAINT "secondBrain_notions_pkey" PRIMARY KEY (id);


--
-- Name: systemServices systemServices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."systemServices"
    ADD CONSTRAINT "systemServices_pkey" PRIMARY KEY (id);


--
-- Name: system_Modules_Enabled system_Modules_Enabled_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."system_Modules_Enabled"
    ADD CONSTRAINT "system_Modules_Enabled_pkey" PRIMARY KEY (id);


--
-- Name: tasksComments tasksComments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_pkey" PRIMARY KEY (id);


--
-- Name: Employee_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_email_key" ON public."Employee" USING btree (email);


--
-- Name: Employee_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Employee_phone_key" ON public."Employee" USING btree (phone);


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: _BoardsToUsers_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_BoardsToUsers_AB_unique" ON public."_BoardsToUsers" USING btree ("A", "B");


--
-- Name: _BoardsToUsers_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BoardsToUsers_B_index" ON public."_BoardsToUsers" USING btree ("B");


--
-- Name: _DocumentsToInvoices_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsToInvoices_AB_unique" ON public."_DocumentsToInvoices" USING btree ("A", "B");


--
-- Name: _DocumentsToInvoices_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsToInvoices_B_index" ON public."_DocumentsToInvoices" USING btree ("B");


--
-- Name: _DocumentsToTasks_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsToTasks_AB_unique" ON public."_DocumentsToTasks" USING btree ("A", "B");


--
-- Name: _DocumentsToTasks_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsToTasks_B_index" ON public."_DocumentsToTasks" USING btree ("B");


--
-- Name: _DocumentsTocrm_Accounts_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Accounts_AB_unique" ON public."_DocumentsTocrm_Accounts" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Accounts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Accounts_B_index" ON public."_DocumentsTocrm_Accounts" USING btree ("B");


--
-- Name: _DocumentsTocrm_Contacts_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Contacts_AB_unique" ON public."_DocumentsTocrm_Contacts" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Contacts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Contacts_B_index" ON public."_DocumentsTocrm_Contacts" USING btree ("B");


--
-- Name: _DocumentsTocrm_Leads_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Leads_AB_unique" ON public."_DocumentsTocrm_Leads" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Leads_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Leads_B_index" ON public."_DocumentsTocrm_Leads" USING btree ("B");


--
-- Name: _DocumentsTocrm_Opportunities_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Opportunities_AB_unique" ON public."_DocumentsTocrm_Opportunities" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Opportunities_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Opportunities_B_index" ON public."_DocumentsTocrm_Opportunities" USING btree ("B");


--
-- Name: _TeamTaskTotasksComments_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_TeamTaskTotasksComments_AB_unique" ON public."_TeamTaskTotasksComments" USING btree ("A", "B");


--
-- Name: _TeamTaskTotasksComments_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_TeamTaskTotasksComments_B_index" ON public."_TeamTaskTotasksComments" USING btree ("B");


--
-- Name: _crm_ContactsTocrm_Opportunities_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_crm_ContactsTocrm_Opportunities_AB_unique" ON public."_crm_ContactsTocrm_Opportunities" USING btree ("A", "B");


--
-- Name: _crm_ContactsTocrm_Opportunities_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_crm_ContactsTocrm_Opportunities_B_index" ON public."_crm_ContactsTocrm_Opportunities" USING btree ("B");


--
-- Name: _watching_accounts_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_watching_accounts_AB_unique" ON public._watching_accounts USING btree ("A", "B");


--
-- Name: _watching_accounts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_watching_accounts_B_index" ON public._watching_accounts USING btree ("B");


--
-- Name: Boards Boards_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Definitions Definitions_userWfDefinitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Definitions"
    ADD CONSTRAINT "Definitions_userWfDefinitionId_fkey" FOREIGN KEY ("userWfDefinitionId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Documents Documents_assigned_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_assigned_user_fkey" FOREIGN KEY (assigned_user) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_created_by_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_created_by_user_fkey" FOREIGN KEY (created_by_user) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_crm_accounts_tasksIDs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_crm_accounts_tasksIDs_fkey" FOREIGN KEY ("crm_accounts_tasksIDs") REFERENCES public."crm_Accounts_Tasks"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_document_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_document_type_fkey" FOREIGN KEY (document_type) REFERENCES public."Documents_Types"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Employee Employee_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Employee Employee_teamsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_teamsId_fkey" FOREIGN KEY ("teamsId") REFERENCES public."Teams"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_assigned_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_assigned_account_id_fkey" FOREIGN KEY (assigned_account_id) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_assigned_user_id_fkey" FOREIGN KEY (assigned_user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_invoice_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_invoice_state_id_fkey" FOREIGN KEY (invoice_state_id) REFERENCES public."invoice_States"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_fromID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_fromID_fkey" FOREIGN KEY ("fromID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_toID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_toID_fkey" FOREIGN KEY ("toID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaySlipData PaySlipData_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaySlipData"
    ADD CONSTRAINT "PaySlipData_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaySlip PaySlip_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaySlip"
    ADD CONSTRAINT "PaySlip_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Request Request_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request"
    ADD CONSTRAINT "Request_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Runtimes Runtimes_workflowDefinitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Runtimes"
    ADD CONSTRAINT "Runtimes_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES public."Definitions"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Schedule Schedule_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Schedule"
    ADD CONSTRAINT "Schedule_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tasks Tasks_section_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_section_fkey" FOREIGN KEY (section) REFERENCES public."Sections"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tasks Tasks_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamMessage TeamMessage_fromID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMessage"
    ADD CONSTRAINT "TeamMessage_fromID_fkey" FOREIGN KEY ("fromID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamMessage TeamMessage_toID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMessage"
    ADD CONSTRAINT "TeamMessage_toID_fkey" FOREIGN KEY ("toID") REFERENCES public."Teams"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamTask TeamTask_teamID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamTask"
    ADD CONSTRAINT "TeamTask_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES public."Teams"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timekeeping Timekeeping_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Timekeeping"
    ADD CONSTRAINT "Timekeeping_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Training Training_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _BoardsToUsers _BoardsToUsers_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BoardsToUsers"
    ADD CONSTRAINT "_BoardsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES public."Boards"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BoardsToUsers _BoardsToUsers_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BoardsToUsers"
    ADD CONSTRAINT "_BoardsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToInvoices _DocumentsToInvoices_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToInvoices"
    ADD CONSTRAINT "_DocumentsToInvoices_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToInvoices _DocumentsToInvoices_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToInvoices"
    ADD CONSTRAINT "_DocumentsToInvoices_B_fkey" FOREIGN KEY ("B") REFERENCES public."Invoices"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToTasks _DocumentsToTasks_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToTasks"
    ADD CONSTRAINT "_DocumentsToTasks_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToTasks _DocumentsToTasks_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToTasks"
    ADD CONSTRAINT "_DocumentsToTasks_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Accounts _DocumentsTocrm_Accounts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Accounts"
    ADD CONSTRAINT "_DocumentsTocrm_Accounts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Accounts _DocumentsTocrm_Accounts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Accounts"
    ADD CONSTRAINT "_DocumentsTocrm_Accounts_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Contacts _DocumentsTocrm_Contacts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Contacts"
    ADD CONSTRAINT "_DocumentsTocrm_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Contacts _DocumentsTocrm_Contacts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Contacts"
    ADD CONSTRAINT "_DocumentsTocrm_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Leads _DocumentsTocrm_Leads_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Leads"
    ADD CONSTRAINT "_DocumentsTocrm_Leads_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Leads _DocumentsTocrm_Leads_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Leads"
    ADD CONSTRAINT "_DocumentsTocrm_Leads_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Leads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Opportunities _DocumentsTocrm_Opportunities_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Opportunities"
    ADD CONSTRAINT "_DocumentsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Opportunities _DocumentsTocrm_Opportunities_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Opportunities"
    ADD CONSTRAINT "_DocumentsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Opportunities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TeamTaskTotasksComments _TeamTaskTotasksComments_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TeamTaskTotasksComments"
    ADD CONSTRAINT "_TeamTaskTotasksComments_A_fkey" FOREIGN KEY ("A") REFERENCES public."TeamTask"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _TeamTaskTotasksComments _TeamTaskTotasksComments_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_TeamTaskTotasksComments"
    ADD CONSTRAINT "_TeamTaskTotasksComments_B_fkey" FOREIGN KEY ("B") REFERENCES public."tasksComments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_ContactsTocrm_Opportunities _crm_ContactsTocrm_Opportunities_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_ContactsTocrm_Opportunities"
    ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES public."crm_Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_ContactsTocrm_Opportunities _crm_ContactsTocrm_Opportunities_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_ContactsTocrm_Opportunities"
    ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Opportunities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _watching_accounts _watching_accounts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._watching_accounts
    ADD CONSTRAINT "_watching_accounts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _watching_accounts _watching_accounts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._watching_accounts
    ADD CONSTRAINT "_watching_accounts_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: crm_Accounts_Tasks crm_Accounts_Tasks_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts_Tasks"
    ADD CONSTRAINT "crm_Accounts_Tasks_account_fkey" FOREIGN KEY (account) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Accounts_Tasks crm_Accounts_Tasks_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts_Tasks"
    ADD CONSTRAINT "crm_Accounts_Tasks_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Accounts crm_Accounts_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Accounts crm_Accounts_industry_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_industry_fkey" FOREIGN KEY (industry) REFERENCES public."crm_Industry_Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Contacts crm_Contacts_accountsIDs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_accountsIDs_fkey" FOREIGN KEY ("accountsIDs") REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Contacts crm_Contacts_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Contacts crm_Contacts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Leads crm_Leads_accountsIDs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Leads"
    ADD CONSTRAINT "crm_Leads_accountsIDs_fkey" FOREIGN KEY ("accountsIDs") REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Leads crm_Leads_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Leads"
    ADD CONSTRAINT "crm_Leads_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_account_fkey" FOREIGN KEY (account) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_campaign_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_campaign_fkey" FOREIGN KEY (campaign) REFERENCES public.crm_campaigns(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_sales_stage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_sales_stage_fkey" FOREIGN KEY (sales_stage) REFERENCES public."crm_Opportunities_Sales_Stages"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_type_fkey" FOREIGN KEY (type) REFERENCES public."crm_Opportunities_Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: openAi_keys openAi_keys_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."openAi_keys"
    ADD CONSTRAINT "openAi_keys_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: secondBrain_notions secondBrain_notions_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."secondBrain_notions"
    ADD CONSTRAINT "secondBrain_notions_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tasksComments tasksComments_assigned_crm_account_task_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_assigned_crm_account_task_fkey" FOREIGN KEY (assigned_crm_account_task) REFERENCES public."crm_Accounts_Tasks"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasksComments tasksComments_employeeID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES public."Employee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tasksComments tasksComments_task_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_task_fkey" FOREIGN KEY (task) REFERENCES public."Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tasksComments tasksComments_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

