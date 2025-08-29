import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Search, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetAIReportsQuery, useGetProductivityAnalyticsQuery } from "@/store/api/aiReportsApi";

interface ComparisonData {
  working: number;
  away: number;
  ideal: number;
}

const AIReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState("graph");
  const [comparison1From, setComparison1From] = useState("");
  const [comparison1To, setComparison1To] = useState("");
  const [comparison2From, setComparison2From] = useState("");
  const [comparison2To, setComparison2To] = useState("");
  const [comparison1Data, setComparison1Data] = useState<ComparisonData | null>(null);
  const [comparison2Data, setComparison2Data] = useState<ComparisonData | null>(null);

  // Use Redux Toolkit Query hooks
  const { data: aiReportsData, isLoading: loadingReports } = useGetAIReportsQuery({ page: 1, limit: 10 });
  const { data: productivityData, isLoading: loadingProductivity } = useGetProductivityAnalyticsQuery({});

  const aiReports = aiReportsData?.data || [];
  const productivity = productivityData?.data;
  const loading = loadingReports || loadingProductivity;

  const prepareChartData = () => {
    // Mock data for charts when no real data is available
    const mockChartData = [
      {
        time: "09:00",
        productivity: 85,
        awayTime: 15,
        workingTime: 45,
        idealTime: 30,
      },
      {
        time: "10:00",
        productivity: 92,
        awayTime: 8,
        workingTime: 52,
        idealTime: 38,
      },
      {
        time: "11:00",
        productivity: 78,
        awayTime: 22,
        workingTime: 38,
        idealTime: 25,
      },
      {
        time: "12:00",
        productivity: 88,
        awayTime: 12,
        workingTime: 48,
        idealTime: 35,
      },
      {
        time: "13:00",
        productivity: 95,
        awayTime: 5,
        workingTime: 55,
        idealTime: 42,
      },
      {
        time: "14:00",
        productivity: 82,
        awayTime: 18,
        workingTime: 42,
        idealTime: 28,
      },
      {
        time: "15:00",
        productivity: 90,
        awayTime: 10,
        workingTime: 50,
        idealTime: 40,
      },
      {
        time: "16:00",
        productivity: 87,
        awayTime: 13,
        workingTime: 47,
        idealTime: 33,
      },
    ];

    if (aiReports.length > 0) {
      return aiReports.map((report) => ({
        time: new Date(report.startTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        productivity: report.productivityScore,
        awayTime: report.awayTime / 60,
        workingTime: report.workingTime / 60,
        idealTime: report.idealTime / 60,
      }));
    }
    
    return mockChartData;
  };

  const handleComparisonSubmit = (comparisonNumber: 1 | 2) => {
    if (comparisonNumber === 1) {
      if (comparison1From && comparison1To) {
        setComparison1Data({
          working: 2400,
          away: 300,
          ideal: 600,
        });
      }
    } else if (comparisonNumber === 2) {
      if (comparison2From && comparison2To) {
        setComparison2Data({
          working: 2100,
          away: 450,
          ideal: 750,
        });
      }
    }
  };

  const renderGraphView = () => {
    const chartData = prepareChartData();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
            Productivity Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="h-48 sm:h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cd0447]"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300} className="text-xs sm:text-sm">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#cd0447"
                  strokeWidth={2}
                  name="Productivity Score"
                />
                <Line
                  type="monotone"
                  dataKey="workingTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Working Time (min)"
                />
                <Line
                  type="monotone"
                  dataKey="awayTime"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Away Time (min)"
                />
                <Line
                  type="monotone"
                  dataKey="idealTime"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Ideal Time (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCompareView = () => {
    const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

    const renderPieChart = (data: ComparisonData | null, title: string, from: string, to: string) => {
      if (!data) return null;

      const pieData = [
        { name: 'Working', value: data.working, color: COLORS[0] },
        { name: 'Away', value: data.away, color: COLORS[1] },
        { name: 'Ideal', value: data.ideal, color: COLORS[2] },
      ];

      return (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Working:</span>
                <span className="font-semibold">{Math.round(data.working)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Away:</span>
                <span className="font-semibold">{Math.round(data.away)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ideal:</span>
                <span className="font-semibold">{Math.round(data.ideal)} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    const renderProductivityComparisonGraph = () => {
      if (!comparison1Data || !comparison2Data) return null;

      const productivityData = [
        {
          name: 'Comparison 1',
          productivity: Math.round((comparison1Data.working / (comparison1Data.working + comparison1Data.away + comparison1Data.ideal)) * 100),
          working: comparison1Data.working,
          away: comparison1Data.away,
          ideal: comparison1Data.ideal
        },
        {
          name: 'Comparison 2',
          productivity: Math.round((comparison2Data.working / (comparison2Data.working + comparison2Data.away + comparison2Data.ideal)) * 100),
          working: comparison2Data.working,
          away: comparison2Data.away,
          ideal: comparison2Data.ideal
        }
      ];

      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Productivity Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#cd0447"
                  strokeWidth={3}
                  name="Productivity %"
                  dot={{ fill: '#cd0447', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <h4 className="font-semibold text-sm mb-2">Comparison 1</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Working:</span>
                    <span className="font-medium">{Math.round(comparison1Data.working)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Away:</span>
                    <span className="font-medium">{Math.round(comparison1Data.away)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ideal:</span>
                    <span className="font-medium">{Math.round(comparison1Data.ideal)} min</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#cd0447]">
                    <span>Productivity:</span>
                    <span>{Math.round((comparison1Data.working / (comparison1Data.working + comparison1Data.away + comparison1Data.ideal)) * 100)}%</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-sm mb-2">Comparison 2</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Working:</span>
                    <span className="font-medium">{Math.round(comparison2Data.working)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Away:</span>
                    <span className="font-medium">{Math.round(comparison2Data.away)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ideal:</span>
                    <span className="font-medium">{Math.round(comparison2Data.ideal)} min</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#cd0447]">
                    <span>Productivity:</span>
                    <span>{Math.round((comparison2Data.working / (comparison2Data.working + comparison2Data.away + comparison2Data.ideal)) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comparison 1 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparison 1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="comp1-from" className="text-sm">From Date & Time</Label>
                    <Input
                      id="comp1-from"
                      type="datetime-local"
                      value={comparison1From}
                      onChange={(e) => setComparison1From(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comp1-to" className="text-sm">To Date & Time</Label>
                    <Input
                      id="comp1-to"
                      type="datetime-local"
                      value={comparison1To}
                      onChange={(e) => setComparison1To(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleComparisonSubmit(1)}
                  className="w-full bg-[#cd0447] hover:bg-[#cd0447]/90"
                >
                  Load Comparison 1
                </Button>
              </CardContent>
            </Card>
            {renderPieChart(comparison1Data, "Comparison 1 Results", comparison1From, comparison1To)}
          </div>

          {/* Comparison 2 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparison 2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="comp2-from" className="text-sm">From Date & Time</Label>
                    <Input
                      id="comp2-from"
                      type="datetime-local"
                      value={comparison2From}
                      onChange={(e) => setComparison2From(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comp2-to" className="text-sm">To Date & Time</Label>
                    <Input
                      id="comp2-to"
                      type="datetime-local"
                      value={comparison2To}
                      onChange={(e) => setComparison2To(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleComparisonSubmit(2)}
                  className="w-full bg-[#cd0447] hover:bg-[#cd0447]/90"
                >
                  Load Comparison 2
                </Button>
              </CardContent>
            </Card>
            {renderPieChart(comparison2Data, "Comparison 2 Results", comparison2From, comparison2To)}
          </div>
        </div>
        {renderProductivityComparisonGraph()}
      </div>
    );
  };

  const renderSearchView = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search AI Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Search functionality will be implemented here. You can search by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Camera ID</li>
              <li>Date range</li>
              <li>Productivity score range</li>
              <li>Location</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Responsive Tab Navigation */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                onClick={() => setActiveTab("graph")}
                variant={activeTab === "graph" ? "default" : "outline"}
                className={`min-h-12 sm:min-h-10 px-4 py-3 sm:py-2 ${
                  activeTab === "graph" 
                    ? "bg-[#cd0447] text-white" 
                    : "text-gray-700"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Graph</span>
              </Button>
              <Button
                onClick={() => setActiveTab("compare")}
                variant={activeTab === "compare" ? "default" : "outline"}
                className={`min-h-12 sm:min-h-10 px-4 py-3 sm:py-2 ${
                  activeTab === "compare" 
                    ? "bg-[#cd0447] text-white" 
                    : "text-gray-700"
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="text-sm sm:text-base">Compare</span>
              </Button>
            </div>

            {activeTab === "graph" && renderGraphView()}
            {activeTab === "compare" && renderCompareView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AIReport;
