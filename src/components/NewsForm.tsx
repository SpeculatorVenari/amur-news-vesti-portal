
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NewsCategory } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Image, Upload } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Заголовок должен содержать минимум 5 символов",
  }),
  summary: z.string().min(10, {
    message: "Краткое описание должно содержать минимум 10 символов",
  }),
  content: z.string().min(50, {
    message: "Содержание новости должно содержать минимум 50 символов",
  }),
  imageUrl: z.string().optional(),
  category: z.enum(['Главное', 'Экономика', 'Культура', 'Спорт'] as [NewsCategory, ...NewsCategory[]]),
  author: z.string().optional(),
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onSubmit: (data: NewsFormValues) => void;
  initialData?: Partial<NewsFormValues>;
  isEdit?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultValues = {
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'Главное' as NewsCategory,
    author: '',
    ...initialData
  };
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: NewsFormValues) => {
    // Если была загружена локальная картинка, используем её URL
    if (selectedImage) {
      data.imageUrl = selectedImage;
    }
    
    onSubmit(data);
    toast({
      title: isEdit ? "Новость обновлена" : "Новость создана",
      description: `Новость "${data.title}" успешно ${isEdit ? 'обновлена' : 'создана'}.`,
    });
  };
  
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Ошибка",
        description: "Разрешены только файлы формата JPG и PNG",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setSelectedImage(e.target.result);
        form.setValue('imageUrl', e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input placeholder="Введите заголовок новости" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Краткое описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Введите краткое описание новости" 
                  {...field}
                  rows={3} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Введите полный текст новости" 
                  {...field}
                  rows={10} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      onClick={handleImageClick}
                    >
                      <Upload size={16} />
                      <span>Загрузить с компьютера</span>
                    </Button>
                    <span className="text-sm text-gray-500">или</span>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value) {
                          setSelectedImage(null);
                        }
                      }}
                    />
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                  />
                  
                  {(selectedImage || field.value) && (
                    <div className="mt-3 relative max-w-xs">
                      <div className="border rounded p-2 bg-gray-50">
                        <img 
                          src={selectedImage || field.value} 
                          alt="Превью изображения" 
                          className="max-h-40 object-contain mx-auto"
                        />
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-500">
                        Превью изображения
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Главное">Главное</SelectItem>
                  <SelectItem value="Экономика">Экономика</SelectItem>
                  <SelectItem value="Культура">Культура</SelectItem>
                  <SelectItem value="Спорт">Спорт</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Автор (опционально)</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя автора" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEdit ? 'Обновить новость' : 'Создать новость'}
        </Button>
      </form>
    </Form>
  );
};

export default NewsForm;
