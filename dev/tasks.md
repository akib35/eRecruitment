### **Day 1 – Setup & Core Structure**

**Goal:** Get the system skeleton running.

**Tasks:**

1.  **Project setup**
    
    -   Initialize backend.
        
    -   Setup database.
        
    -   Create frontend scaffold.
        
2.  **User & Role Management**
    
    -   Add login/signup (hardcode roles for now: Admin, HR, Recruiter, Final Confirmer).
        
    -   Create role-based dashboards (basic pages).
        
3.  **Job Request Module**
    
    -   Recruiter form → submit new job request.
        
    -   HR dashboard → view pending requests.
        

**Delivery:**  
Working login system + recruiter can submit job requests + HR can see them.

___

### **Day 2 – HR Approval & Candidate Upload**

**Goal:** Allow HR to approve requests and manage candidate info.

**Tasks:**

1.  **Job Request Workflow**
    
    -   HR can approve/reject job requests.
        
    -   Status updates automatically (“Pending → Approved → Open”).
        
2.  **Candidate Upload Module**
    
    -   HR uploads candidate info + attach CV (PDF).
        
    -   Store candidate info in database.
        
3.  **Candidate List View**
    
    -   Display all uploaded candidates under each job request.
        

**Delivery:**  
HR can approve job requests, upload candidate data, and view candidate list.

___

### **Day 3 – Shortlisting & Interview Scheduling**

**Goal:** Enable HR and Recruiter collaboration on candidate review.

**Tasks:**

1.  **Shortlisting Feature**
    
    -   HR and Recruiter can mark candidates as _Shortlisted_ or _Rejected_.
        
2.  **Interview Scheduling**
    
    -   Add simple form for scheduling date/time.
        
    -   Attach interviewer notes.
        
3.  **Interview Dashboard**
    
    -   Display scheduled interviews with candidate details.
        

**Delivery:**  
Recruiter & HR can shortlist candidates and set interview schedules.

___

### **Day 4 – Results, Confirmation, and Logging**

**Goal:** Complete the final workflow and wrap up MVP.

**Tasks:**

1.  **Interview Result Update**
    
    -   HR/Recruiter can update outcomes (Selected, Rejected, Hold).
        
2.  **Final Confirmation**
    
    -   Generate simple summary view (job + candidate info + results).
        
    -   Final Confirmer can mark “Confirmed.”
        
3.  **Logging**
    
    -   Log key actions (e.g., “Recruiter requested opening,” “HR approved,” etc.).
        
4.  **Polish UI & Testing**
    
    -   Quick CSS cleanup.
        
    -   Test all role flows (Recruiter → HR → Final Confirmer).
        

**Delivery:**  
Full end-to-end flow works: request → approval → upload → shortlist → interview → confirm → close.
