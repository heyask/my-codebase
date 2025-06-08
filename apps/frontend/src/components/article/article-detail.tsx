'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AppConfig } from 'core/utils/app-config';
import { Button } from 'core/components/ui/button';
import { Input } from 'core/components/ui/input';
import { cloneDeep, map, omit } from 'lodash-es';
import { ArticleType, IArticle } from 'core-types/interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { articleApi } from 'core/apis/article.api';
import dayjs from 'dayjs';
import Editor from 'core/components/editor/Editor';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { SharedHistoryContext } from 'core/components/editor/context/SharedHistoryContext';
import { TableContext } from 'core/components/editor/plugins/TablePlugin';
import { SharedAutocompleteContext } from 'core/components/editor/context/SharedAutocompleteContext';
import PlaygroundNodes from 'core/components/editor/nodes/PlaygroundNodes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'core/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'core/components/ui/popover';
import { cn } from 'core/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from 'core/components/ui/calendar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'core/components/ui/breadcrumb';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'core/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from 'core/components/ui/use-toast';

/**
 * 참고용 타 프로젝트의 폼이 있는 페이지(Upsert) 코드입니다.
 */
export default function ArticleDetail({ t }: PageComponentProps) {
  const params = useParams();
  const { toast } = useToast();
  const [article, setArticle] = useState<IArticle>({
    url: '',
    category: '',
    thumbnails: [],
    title: '',
    content: '',
    articleType: ArticleType.Blog,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreviews, setThumbnailPreviews] = useState<
    {
      isPreview: boolean;
      data: string;
    }[]
  >([]);
  const {
    data: articleData,
    refetch: refetchArticleData,
    isLoading: isLoadingArticles,
  } = useQuery({
    queryKey: [
      'article',
      {
        id: Number(params.id),
      },
    ],
    queryFn: articleApi.common.getArticle,
  });
  const { mutateAsync: updateArticleMutateAsync } = useMutation({
    mutationFn: articleApi.admin.updateArticle,
  });

  useEffect(() => {
    if (articleData) {
      setArticle(articleData.article);
    }
  }, [articleData]);

  const changeImage = async (images: FileList | null, key: keyof IArticle) => {
    if (!article || !images) return;

    const _article = cloneDeep(article);
    const previews: typeof thumbnailPreviews = [];

    for await (const image of images) {
      const res: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(image);
      });
      previews.push({
        isPreview: true,
        data: res,
      });
    }
    // @ts-ignore
    _article[key] = images;
    setArticle(_article);
    setThumbnailPreviews(previews);
  };

  const formSchema = z.object({
    title: z.string().min(2),
    url: z.string().url().optional().or(z.literal('')),
    // url: z.string().url().optional(),
    category: z.string().optional(),
    articleType: z.custom<ArticleType>(),
    // z.custom<ArticleType>((val) => getValues(ArticleType).includes(val))
    // thumbnails: z.instanceof(File).optional(),
    thumbnails: z.any().optional(),
    createdAt: z.string().optional(),
    description: z.string().optional(),
    content: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: article,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!article) return;

    setIsLoading(true);
    try {
      await updateArticleMutateAsync({
        id: article.id!,
        article: { ...article },
      });
      await refetchArticleData();
      toast({
        variant: 'success',
        description: '수정되었습니다.',
      });
    } catch (e) {
      let message = String(e);
      if (typeof e === 'string') {
        message = e.toUpperCase(); // works, `e` narrowed to string
      } else if (e instanceof Error) {
        message = e.message; // works, `e` narrowed to Error
      }
      toast({
        variant: 'destructive',
        description: message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="content-container">
      <nav>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/articles">아티클 관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>수정</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <section className="p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    제목 <span className="required" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setArticle({
                          ...article,
                          title: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setArticle({
                          ...article,
                          url: e.target.value,
                        });
                      }}
                    />
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
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setArticle({
                          ...article,
                          category: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="articleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    유형 <span className="required" />
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={String(field.value)}
                      onValueChange={(value) => {
                        setArticle({
                          ...article,
                          articleType: Number(value) as ArticleType,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ArticleType).map((value) => (
                          <SelectItem
                            key={`filter${value}`}
                            value={String(value)}
                          >
                            {t.articleType[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>썸네일</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...omit(field, 'value')}
                      onChange={(e) =>
                        changeImage(e.target.files, 'thumbnails')
                      }
                    />
                  </FormControl>
                  {article &&
                    (article.thumbnails?.length > 0 ||
                      thumbnailPreviews?.length > 0) && (
                      <div className="grid grid-cols-3 gap-4">
                        {map(
                          (thumbnailPreviews?.length > 0
                            ? thumbnailPreviews
                            : article.thumbnails) as
                            | typeof thumbnailPreviews
                            | string[],
                          (thumbnail, idx) => (
                            <Image
                              key={`thumbnail-${idx}`}
                              unoptimized
                              width={240}
                              height={240}
                              className="object-cover"
                              alt=""
                              src={
                                typeof thumbnail === typeof thumbnailPreviews
                                  ? (
                                      thumbnail as (typeof thumbnailPreviews)[number]
                                    ).data
                                  : `${AppConfig.FILE_HOST}/uploads/${thumbnail}`
                              }
                            />
                          )
                        )}
                      </div>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    날짜 <span className="required" />
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !article.createdAt && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {article.createdAt ? (
                            dayjs(article.createdAt).format('MM/DD/YY')
                          ) : (
                            <span />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dayjs(article.createdAt).toDate()}
                          onSelect={async (_, value) => {
                            setArticle({
                              ...article,
                              createdAt: dayjs(value).format(
                                'YYYY-MM-DD HH:mm:ss'
                              ),
                            });
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setArticle({
                          ...article,
                          description: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormDescription>#해쉬태그, 띄워쓰기로 구분</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <LexicalComposer
                      initialConfig={{
                        namespace: 'MyEditor',
                        nodes: [...PlaygroundNodes],
                        theme: {
                          heading: {
                            h1: 'font-bold text-4xl',
                            h2: 'font-bold text-3xl',
                            h3: 'font-bold text-2xl',
                            h4: 'font-bold text-xl',
                            h5: 'font-bold text-lg',
                            h6: 'font-bold text-base',
                          },
                          text: {
                            bold: 'font-bold',
                            code: 'code',
                            italic: 'italic',
                            strikethrough: 'line-through',
                            underline: 'underline',
                            underlineStrikethrough: 'underline line-through',
                          },
                        },
                        onError: (error) => {
                          console.error(error);
                        },
                      }}
                    >
                      <SharedHistoryContext>
                        <TableContext>
                          <SharedAutocompleteContext>
                            <div className="editor-shell">
                              <Editor
                                initialHtml={field.value}
                                onHtmlChanged={(value) => {
                                  setArticle({
                                    ...article,
                                    content: value,
                                  });
                                }}
                              />
                            </div>
                          </SharedAutocompleteContext>
                        </TableContext>
                      </SharedHistoryContext>
                    </LexicalComposer>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="form-actions-container">
              <Button type="submit" isLoading={isLoading}>
                제출
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
