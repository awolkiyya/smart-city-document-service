import { DocumentType } from "../services/path.service";

export interface KPI {
    /**
     * =====================================================
     * KPI IDENTIFICATION
     * =====================================================
     */
    id: string;
  
    indicator: string;
  
    /**
     * =====================================================
     * KPI META
     * =====================================================
     */
    weight: number;
  
    unit: string;
  
    baseline: number;
  
    target: number;
  
    /**
     * =====================================================
     * QUARTERLY EXECUTION
     * =====================================================
     */
    q1: number;
  
    q2: number;
  
    q3: number;
  
    q4: number;
  
    /**
     * =====================================================
     * OPTIONAL COMPUTED VALUES
     * =====================================================
     */
    totalExecution?: number;
  
    achievement?: number;
    yeero?: string;

  }


  
  export interface Activity {
  
    title: string;
  
  }
  

  export interface MainObjective {
    title: string;
  }

  export interface WorkflowUser {
    name?: string;
    date?: string;
  }
  
  export interface Workflow {
    prepared?: string;
    approved?: string;
    verified?: string;
  
    p_date?: string;
    a_date?: string;
    v_date?: string;
  }



  /**
 * =====================================================
 * REPORT PAYLOAD
 * =====================================================
 */
export interface PlanPayload {
  data: PlanData;

  file_path: string;

  type: DocumentType;

  template_version?: string;
}
  
  export interface PlanData {
    /**
     * =====================================================
     * BASIC INFORMATION
     * =====================================================
     */
    cityName: string;
  
    sectorName: string;
  
    year: string;
  
    month: string;
  
    subcity?: string;
  
    wereda?: string;

    name?:string;
  
    /**
     * =====================================================
     * PLAN META
     * =====================================================
     */
    planName?: string;
    
    rawwi?: string;
  
    galma?: string;
  
    /**
     * =====================================================
     * DYNAMIC REPORT SECTIONS
     * =====================================================
    */
    sections: Record<string, string>;
  
    /**
     * =====================================================
     * PLANNING STRUCTURE
     * =====================================================
     */
    galmoota_tarsimawa?: MainObjective[];

    kayyoolee?: Activity[];
    
    /**
     * =====================================================
     * HIERARCHICAL PLANNING STRUCTURE
     * =====================================================
     */
    kpis?: KPI[];

    /**
     * =====================================================
     * WORKFLOW (NEW)
     * =====================================================
     */
    workflow?: Workflow;
  }