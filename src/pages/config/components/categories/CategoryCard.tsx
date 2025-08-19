import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Calendar, Building2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category, Service, isAllCategoriesResponse } from "./types";
import { convertFirestoreTimestamp, getCategoryDisplayName } from "./utils";
interface CategoryCardProps {
  category: Category;
  service: Service | undefined;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function CategoryCard({
  category,
  service,
  onEdit,
  onDelete,
  onClick
}: CategoryCardProps) {
  const isActive = isAllCategoriesResponse(category) ? true : !category.isDeleted;
  const isPerItem = service?.pricingModel === 'per_item';
  const serviceName = service?.name || 'Unknown Service';
  const pricingModel = service?.pricingModel || 'unknown';

  return (
    <Card 
      className="group relative overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50/50 transform hover:-translate-y-1 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors shadow-sm">
              <Tag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                {getCategoryDisplayName(category)}
              </CardTitle>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  isActive 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            {isPerItem && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                onClick={onEdit}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-purple-50/30 border border-gray-100 shadow-sm">
            <Building2 className="h-4 w-4 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {serviceName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {pricingModel.replace('_', ' ')} pricing
              </p>
            </div>
          </div>

          {!isAllCategoriesResponse(category) && category.createdAt && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created {convertFirestoreTimestamp(category.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Click to view products
            </span>
            <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}