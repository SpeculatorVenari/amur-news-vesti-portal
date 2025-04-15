
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NewsCategory } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
  imageUrl: z.string().url({
    message: "Пожалуйста, введите корректный URL изображения",
  }),
  category: z.enum(['Общество', 'Экономика', 'Культура', 'Спорт'] as [NewsCategory, ...NewsCategory[]]),
  author: z.string().optional(),
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onSubmit: (data: NewsFormValues) => void;
  defaultValues?: Partial<NewsFormValues>;
  isEdit?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({
  onSubmit,
  defaultValues = {
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'Общество',
    author: '',
  },
  isEdit = false,
}) => {
  const { toast } = useToast();
  
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: NewsFormValues) => {
    onSubmit(data);
    toast({
      title: isEdit ? "Новость обновлена" : "Новость создана",
      description: `Новость "${data.title}" успешно ${isEdit ? 'обновлена' : 'создана'}.`,
    });
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
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
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
                  <SelectItem value="Общество">Общество</SelectItem>
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
